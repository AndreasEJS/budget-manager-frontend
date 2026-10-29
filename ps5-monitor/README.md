# PS5 Pro-bevakare

Kollar produktsidor med jämna mellanrum och skickar en push-notis till telefonen när PS5 Pro går från slut till i lager. Inga beroenden, kräver Node 18+.

## Kom igång
1. Installera appen **ntfy** på telefonen (iOS/Android) och prenumerera på ett långt, hemligt ämnesnamn (vem som helst som känner namnet kan läsa/skicka notiser).
2. `cp config.example.json config.json`, fyll i `ntfyTopic` (samma namn som i appen) och klistra in produktlänkar till PS5 Pro hos de butiker du vill bevaka.
3. `node monitor.mjs` – du får en testnotis direkt. Låt den ligga och köra (t.ex. `nohup node monitor.mjs &`, tmux, eller en Raspberry Pi/server).

## Lagerdetektering
- Standard: läser schema.org-`availability` (InStock/OutOfStock) ur sidan. Fungerar på butiker som har det.
- Om en sida saknar det loggas "kunde inte avgöra". Ange då `outOfStockRegex` och/eller `inStockRegex` (t.ex. text på knappen) för den sidan.
- Sidor som laddar lagerstatus med JavaScript efter sidladdning syns inte för denna enkla hämtning.

Notis skickas bara vid övergång till i lager (inte var femte minut). `node test.mjs` kör enhetstester.
