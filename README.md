# Sudoku Mystery MVP

Offline mobilni MVP hra v React Native, Expo a TypeScriptu. Hrac prochazi pet kapitol stareho hotelu, resi klasicke sudoku 9x9, sbira stopy a postupne odemyka finalni odhaleni medailonu.

## Spusteni lokalne

```bash
npm install
npx expo start
```

Expo otevře Metro bundler s QR kodem a volbami pro zarizeni/emulator.

## Spusteni ve webovem prohlizeci pro debugging

Web varianta slouzi hlavne pro rychle ladeni UI, navigace a herni logiky v prohlizeci.

```bash
npm run web
```

Pripadne:

```bash
npx expo start --web --clear
```

Expo otevře aplikaci v prohlizeci, typicky na adrese:

```text
http://localhost:8081
```

Pokud uz port `8081` pouziva jiny proces, Expo nabidne dalsi port. V prohlizeci pak pouzij adresu, kterou vypise terminal.

Pro ladeni pouzij DevTools v prohlizeci:

- Console pro runtime chyby
- Network pro assety a bundle
- Responsive/device toolbar pro kontrolu mobilniho layoutu

Poznamka: web build je urceny pro debugging MVP. Primarni cilova platforma zustava Android telefon pres Expo Go.

## Dev Admin / testovaci rezim

V development rezimu je v aplikaci viditelne nenapadne tlacitko `DEV` / `DEV Admin` na uvodni obrazovce a na mape hotelu.

Dev Admin je dostupny pouze pri vyvoji pres `__DEV__`; v produkcnim buildu se vstup nezobrazuje.

V Dev Admin rezimu lze:

- otevrit detail libovolne kapitoly
- spustit sudoku libovolne kapitoly
- zobrazit reward libovolne kapitoly
- oznacit kapitolu nebo vsechny kapitoly jako dokoncene
- odemknout vsechny kapitoly
- pridat nebo odebrat jednotlive rewardy z evidence
- pridat vsechny rewardy
- otevrit evidenci stop a finalni obrazovku
- resetovat kapitolu, cely postup hry nebo vymazat lokalni uloziste

Na sudoku obrazovce se v development rezimu zobrazuje panel `DEV Sudoku` s akcemi:

- `Vyplnit reseni`
- `Dokoncit sudoku`
- `Reset sudoku`
- `+ napoveda`

Rychly test cele hry:

1. Spust aplikaci:

```bash
npx expo start --clear
```

2. Otevri `DEV Admin`.
3. Klikni na `Odemknout vse` nebo `Dokoncit vse`.
4. Pres kapitoly nebo globalni akce otevri reward, evidenci nebo finale.

## Otevreni na Android telefonu pres Expo Go

1. Nainstaluj aplikaci Expo Go z Google Play.
2. Telefon a pocitac pripoj ke stejne Wi-Fi siti.
3. V projektu spusť:

```bash
npx expo start
```

4. Naskenuj QR kod z terminalu nebo z Expo Dev Tools v aplikaci Expo Go.

Aplikace je navrzena jako offline-first. Po nacteni bezi bez backendu a internet neni potreba pro herni postup.

## Spusteni na Android emulatoru

1. Spusť Android Studio a otevri Android Virtual Device.
2. Nastartuj emulator.
3. V projektu spusť:

```bash
npx expo start
```

4. V terminalu stiskni `a`, pripadne pouzij:

```bash
npm run android
```

## Priprava pro budouci Android APK pres EAS Build

Projekt je kompatibilni s Expo Go a neobsahuje vlastni native moduly mimo Expo-kompatibilni knihovny. Pro budouci APK lze doplnit EAS konfiguraci:

```bash
npm install -g eas-cli
eas login
eas build:configure
eas build -p android --profile preview
```

## Struktura

```text
src/
  components/       sdilene UI komponenty, sudoku mrizka, ciselnik, karty
  data/             kapitoly a rucne pripravene sudoku podklady
  hooks/            lokalni herni stav a sudoku mechanika
  locales/          ceske texty pripravene pro budouci preklad
  navigation/       React Navigation stack
  screens/          obrazovky aplikace
  storage/          AsyncStorage perzistence
  theme/            barvy, mezery, typografie
  types/            datove modely
```

## Co MVP obsahuje

- splash screen, intro, mapa hotelu, detail kapitoly, sudoku, odmena, evidence stop a finale
- pet kapitol s rucne pripravenymi daty
- sudoku 9x9 s cisly, poznamkami, mazanim, undo, napovedou, overenim zapisu a casem
- postupne odemykani kapitol a lokalni ukladani pres AsyncStorage
- placeholder vizualy pro hotel, lokace a odmeny bez vzdalenych URL
