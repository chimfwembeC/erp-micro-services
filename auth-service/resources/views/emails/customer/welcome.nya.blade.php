<x-mail::message>
# Takulandirani ku TekRem, {{ $name }}!

Zikomo polembetsa ku TekRem. Akaunti yanu ya wogula yapangidwa bwino.

## Akaunti Yanu ya Wogula

Monga wogula, tsopano muli ndi mwayi wa:

- Kuona ndi kuyanganira mbiri yanu
- Kuyika ndi kutsatira maoda
- Kuona ndi kutsitsa makalata a ntchito
- Kutumiza ndi kutsatira makalata a thandizo

<x-mail::button :url="$url">
    Lowani ku Dashbodi Yanu
</x-mail::button>

Ngati muli ndi mafunso kapena mukufuna thandizo, musazengereze kutumiza ku gulu lathu la thandizo.

Zikomo,<br>
{{ config('app.name') }}
</x-mail::message>
