<x-mail::message>
# Twamuswaya ku TekRem, {{ $name }}!

Twalumba kulilemba ku TekRem. Akaunti yanu ya sikuula yapangwa kabotu.

## Akaunti Yanu ya Sikuula

Mbuli sikuula, lino mujisi nguzu zya:

- Kubona a kulanganya makani anu
- Kumbila a kukonka nkumbizyo
- Kubona a kudownload mapepa a mulimo
- Kutuma a kukonka mapepa a lugwasyo

<x-mail::button :url="$url">
    Njila mu Dashibodi Yanu
</x-mail::button>

Kuti mujisi mibuzyo na muyanda lugwasyo, mutakwe kudonaika kutuma ku nkamu yesu ya lugwasyo.

Twalumba,<br>
{{ config('app.name') }}
</x-mail::message>
