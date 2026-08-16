{{-- resources/views/emails/inscripcion_confirmada.blade.php --}}
<p>Hola {{ $nombre }},</p>
<p>Tu inscripción fue registrada con éxito. Tu código de confirmación es:</p>
<h2>{{ $codigo }}</h2>
<p>Preséntalo el día del evento para hacer check-in.</p>