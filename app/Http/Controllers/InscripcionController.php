<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreInscripcionRequest;
use App\Models\Evento;
use App\Models\Inscripcion;
use App\Models\Usuario;
use App\Http\Controllers\Repositories\InscripcionRepository;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Response as ResponseFacade;
use Symfony\Component\HttpFoundation\StreamedResponse;

class InscripcionController extends Controller
{
    public function __construct(private InscripcionRepository $inscripciones)
    {
    }

    public function index(Request $request, Evento $evento)
    {
        $this->autorizarPropietario($request, $evento);

        $estado = $request->query('estado'); // Activa | Cancelada (opcional)

        //busca las inscripciones del evento y carga la relación con el participante, seleccionando solo los campos necesarios
        //nos devuelve la lista de inscripciones del evento, ordenadas por fecha de inscripción, y mapea cada inscripción a un array con los datos relevantes del participante y la inscripción.
        $inscripciones = $this->inscripciones->listarPorEvento($evento->id_evento, $estado)
            ->map(function (Inscripcion $i) {
                return [
                    'id_inscripcion'      => $i->id_inscripcion,
                    'nombre'              => $i->participante->nombre_completo,
                    'correo'              => $i->participante->correo_institucional,
                    'fecha_inscripcion'   => $i->fecha_inscripcion,
                    'estado_inscripcion'  => $i->estado_inscripcion,
                    'estado_asistencia'   => $i->estado_asistencia,
                    'codigo_confirmacion' => $i->codigo_confirmacion,
                ];
            });

        return response()->json([
            'mensaje' => 'Lista de inscritos obtenida correctamente.',
            'inscripciones' => $inscripciones,
        ], 200);
    }

    public function store(StoreInscripcionRequest $request, Evento $evento)
    {
        $this->autorizarPropietario($request, $evento);

        $participante = $request->filled('id_participante')
            ? Usuario::findOrFail($request->id_participante)
            : Usuario::where('correo_institucional', $request->correo_institucional)->firstOrFail();//si el request tiene id_participante, busca al usuario por su ID; de lo contrario, busca al usuario por su correo institucional. Si no encuentra al usuario, lanza una excepción 404.

        // Regla: un participante cancelado no puede volver a inscribirse si el cupo está lleno
        $fueCancelado = $this->inscripciones->existeCanceladaDe($evento->id_evento, $participante->id_usuario);//esto verifica si ya tuvo una inscripcion y devuelve true si la tuvo y false si no la tuvo

        if ($fueCancelado && $evento->cupoLleno()) {
            return response()->json([
                'mensaje' => 'Este participante canceló su inscripción previamente y no puede reinscribirse: el cupo del evento está lleno.',
            ], 422);
        }

        if ($evento->cupoLleno()) {
            return response()->json([
                'mensaje' => 'No es posible inscribir al participante: el evento alcanzó su capacidad máxima.',
            ], 422);
        }

        $yaActivo = $this->inscripciones->existeActivaDe($evento->id_evento, $participante->id_usuario);

        if ($yaActivo) {
            return response()->json([
                'mensaje' => 'El participante ya cuenta con una inscripción activa en este evento.',
            ], 422);
        }

        //creaa la inscripcion manualmente, asignando el ID del evento, el ID del participante, la fecha y hora actual como fecha de inscripción, y estableciendo los estados de inscripción y asistencia.
        $inscripcion = $this->inscripciones->crear([
            'id_evento'          => $evento->id_evento,
            'id_participante'    => $participante->id_usuario,
            'fecha_inscripcion'  => now(), //nos ayuda a registrar la fecha y hora exacta en que se realiza la inscripción en tiempo real
            'estado_inscripcion' => 'Activa',
            'estado_asistencia'  => 'Pendiente',
        ]);

        return response()->json([ //devuelve un mensaje de éxito y los datos de la inscripción recién creada, incluyendo la información del participante.
            'mensaje' => 'Participante añadido manualmente con éxito.',
            'inscripcion' => $inscripcion->load('participante:id_usuario,nombre_completo,correo_institucional'),
        ], 201);
    }

    public function cancelar(Request $request, Inscripcion $inscripcion)
    {
        $this->autorizarPropietario($request, $inscripcion->evento);

        if ($inscripcion->estado_inscripcion === 'Cancelada') {
            return response()->json([
                'mensaje' => 'La inscripción ya se encuentra cancelada.',
            ], 422);
        }

        $this->inscripciones->cancelar($inscripcion);

        return response()->json([
            'mensaje' => 'Inscripción cancelada correctamente.',
            'inscripcion' => $inscripcion->fresh(),
        ], 200);
    }

    public function checkin(Request $request) //esta función permite registrar la asistencia de un participante a un evento, ya sea mediante el ID de inscripción o el código de confirmación.
    {
        $request->validate([
            'id_inscripcion'      => 'required_without:codigo_confirmacion|integer',
            'codigo_confirmacion' => 'required_without:id_inscripcion|string',
        ]);

        $inscripcion = $request->filled('id_inscripcion') //el filled funciona para verificar si el campo id_inscripcion está presente y no está vacío en la solicitud. Si es así, busca la inscripción por su ID; de lo contrario, busca la inscripción por el código de confirmación.
            ? $this->inscripciones->buscarPorId($request->id_inscripcion)
            : $this->inscripciones->buscarPorCodigo($request->codigo_confirmacion);

        if (!$inscripcion) {
            return response()->json(['mensaje' => 'No se encontró la inscripción indicada.'], 404);
        }

        $evento = $inscripcion->evento;
        $this->autorizarPropietario($request, $evento);

        if (!$evento->esFechaDelEvento()) {
            return response()->json([
                'mensaje' => 'El registro de asistencia solo puede realizarse durante la fecha del evento.',
            ], 422);
        }

        if ($inscripcion->estado_inscripcion === 'Cancelada') {
            return response()->json([
                'mensaje' => 'No se puede registrar asistencia: la inscripción está cancelada.',
            ], 422);
        }

        if ($inscripcion->estado_asistencia === 'Confirmada') {
            return response()->json([
                'mensaje' => 'La asistencia de este participante ya fue registrada.',
            ], 422);
        }

        $this->inscripciones->confirmarAsistencia($inscripcion);

        return response()->json([
            'mensaje' => 'Asistencia registrada correctamente.',
            'inscripcion' => $inscripcion->fresh()->load('participante:id_usuario,nombre_completo,correo_institucional'),
        ], 200);
    }

    public function exportar(Request $request, Evento $evento): StreamedResponse
    {
        $this->autorizarPropietario($request, $evento);

        $estado = $request->query('estado');

        $inscripciones = $this->inscripciones->listarPorEvento($evento->id_evento, $estado);

        $nombreArchivo = 'inscritos_evento_' . $evento->id_evento . '_' . now()->format('Ymd_His') . '.csv';

        return ResponseFacade::stream(function () use ($inscripciones) {
            $output = fopen('php://output', 'w');
            fwrite($output, "\xEF\xBB\xBF"); // BOM UTF-8 para Excel

            fputcsv($output, ['Nombre', 'Correo', 'Fecha de inscripción', 'Estado', 'Asistencia', 'Código de confirmación']);

            foreach ($inscripciones as $i) {
                fputcsv($output, [
                    $i->participante->nombre_completo,
                    $i->participante->correo_institucional,
                    $i->fecha_inscripcion,
                    $i->estado_inscripcion,
                    $i->estado_asistencia,
                    $i->codigo_confirmacion,
                ]);
            }

            fclose($output);
        }, 200, [
            'Content-Type'        => 'text/csv; charset=UTF-8',
            'Content-Disposition' => 'attachment; filename="' . $nombreArchivo . '"',
        ]);
    }

    public function ocupacion(Request $request, Evento $evento)
    {
        $this->autorizarPropietario($request, $evento);

        $inscritos  = $evento->inscritosActivos();
        $capacidad  = $evento->capacidad_maxima;
        $porcentaje = $capacidad > 0 ? round(($inscritos / $capacidad) * 100, 2) : 0;

        return response()->json([
            'mensaje' => 'Ocupación calculada correctamente.',
            'ocupacion' => [
                'id_evento'            => $evento->id_evento,
                'nombre_evento'        => $evento->nombre_evento,
                'inscritos_activos'    => $inscritos,
                'capacidad_maxima'     => $capacidad,
                'porcentaje_ocupacion' => $porcentaje,
                'cupo_lleno'           => $evento->cupoLleno(),
            ],
        ], 200);
    }

    private function autorizarPropietario(Request $request, Evento $evento): void
    {
        $usuario = $request->user();

        $esAdmin = $usuario->id_rol === 1;
        $esDueno = $usuario->id_usuario === $evento->id_organizador;

        if (!$esAdmin && !$esDueno) {
            abort(403, 'No tienes permiso para gestionar las inscripciones de este evento.');
        }
    }


    // MÉTODOS EXCLUSIVOS PARA LA APLICACIÓN MÓVIL (PARTICIPANTES)

    public function inscribirseApp(Request $request, Evento $evento)
    {
        // 1. Identificamos al estudiante usando su Token (Sin pedir correo)
        $participante = $request->user();

        // 2. Regla Módulo 8: Bloquear si el evento ya pasó
        if (now()->isAfter($evento->fecha_inicio)) {
            return response()->json([
                'mensaje' => 'No puedes inscribirte: el evento ya ha comenzado o ya pasó.',
            ], 422);
        }

        // 3. Regla Módulo 8: Validar cupo lleno
        if ($evento->cupoLleno()) {
            return response()->json([
                'mensaje' => 'Lo sentimos, el evento ha alcanzado su capacidad máxima.',
            ], 422);
        }

        // 4. Regla Módulo 8: No se puede inscribir más de una vez (Usando el Repository)
        $yaActivo = $this->inscripciones->existeActivaDe($evento->id_evento, $participante->id_usuario);

        if ($yaActivo) {
            return response()->json([
                'mensaje' => 'Ya te encuentras inscrito en este evento.',
            ], 422);
        }

        // 5. Crear inscripción (Usando el Repository)
        $inscripcion = $this->inscripciones->crear([
            'id_evento'          => $evento->id_evento,
            'id_participante'    => $participante->id_usuario,
            'fecha_inscripcion'  => now(),
            'estado_inscripcion' => 'Activa',
            'estado_asistencia'  => 'Pendiente',
        ]);

        return response()->json([
            'mensaje' => '¡Inscripción realizada con éxito desde la App!',
            'inscripcion' => $inscripcion,
        ], 201);
    }


    //metodo para cancelar desde movil
    public function cancelarApp(Request $request, Inscripcion $inscripcion)
    {
        $participante = $request->user();

        // 1. Regla de Seguridad: Verificar que el estudiante solo cancele SU propia inscripción
        if ($inscripcion->id_participante !== $participante->id_usuario) {
            return response()->json([
                'mensaje' => 'Acceso denegado: No puedes cancelar una inscripción que no es tuya.',
            ], 403);
        }

        // 2. Verificar que no esté cancelada ya
        if ($inscripcion->estado_inscripcion === 'Cancelada') {
            return response()->json([
                'mensaje' => 'Esta inscripción ya se encuentra cancelada.',
            ], 422);
        }

        // 3. Regla Módulo 8: Bloquear cancelación el mismo día del evento (o si ya pasó)
        $evento = $inscripcion->evento;
        
        // Comparamos solo la parte de la fecha (Año-Mes-Día) ignorando la hora
        $fechaEvento = \Carbon\Carbon::parse($evento->fecha_inicio)->format('Y-m-d');
        $hoy = now()->format('Y-m-d');

        if ($hoy >= $fechaEvento) {
            return response()->json([
                'mensaje' => 'No es posible cancelar: las cancelaciones se bloquean el mismo día del evento.',
            ], 422);
        }

        // 4. Cancelar usando el Repository limpio de tu compañera
        $this->inscripciones->cancelar($inscripcion);

        return response()->json([
            'mensaje' => 'Tu inscripción ha sido cancelada con éxito.',
            'inscripcion' => $inscripcion->fresh(),
        ], 200);
    }


}