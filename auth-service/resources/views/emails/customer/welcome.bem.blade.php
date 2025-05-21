<x-mail::message>
# Mwaiseni ku TekRem, {{ $name }}!

Twatotela pa kulemba ku TekRem. Akaunti yenu ya kashitisha yapangwa bwino.

## Akaunti Yenu ya Kashitisha

Nga kashitisha, nomba mwakwata insambu sha:

- Ukumona no kutungulula ilyashi lyenu
- Ukulomba no kukonka ifyakulomba
- Ukumona no kudownload amakalata ya mulimo
- Ukutuma no kukonka amakalata ya bwafwilisho

<x-mail::button :url="$url">
    Ingila mu Dashibodi Yenu
</x-mail::button>

Nga mwalikwata amepusho nangu mulefwaya ubwafwilisho, mwiesha ukutwenekela ukutuma ku ibumba lyesu ilya bwafwilisho.

Twatotela,<br>
{{ config('app.name') }}
</x-mail::message>
