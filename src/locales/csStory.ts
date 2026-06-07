type GameChapterText = {
  title: string;
  subtitle: string;
  tone: string;
  revealTitle: string;
  revealText: string;
  revealCta: string;
};

type RoomText = {
  locationName: string;
  shortDescription: string;
  detailText: string;
  clueTitle: string;
  rewardTitle?: string;
  clueDescription: string;
};

type GameChapterTextId =
  | 'chapter-01-arrival'
  | 'chapter-02-exploration'
  | 'chapter-03-staff-area'
  | 'chapter-04-shift-name'
  | 'chapter-05-case-214';

type RoomTextId =
  | 'room-01'
  | 'room-02'
  | 'room-03'
  | 'room-04'
  | 'room-05'
  | 'room-06'
  | 'room-07'
  | 'room-08'
  | 'room-09'
  | 'room-10'
  | 'room-11'
  | 'room-12'
  | 'room-13'
  | 'room-14'
  | 'room-15'
  | 'room-16'
  | 'room-17'
  | 'room-18'
  | 'room-19'
  | 'room-20'
  | 'room-21'
  | 'room-22'
  | 'room-23'
  | 'room-24'
  | 'room-25';

export type StoryLocale = {
  gameChapters: Record<GameChapterTextId, GameChapterText>;
  rooms: Record<RoomTextId, RoomText>;
};

export const csStory: StoryLocale = {
  gameChapters: {
    'chapter-01-arrival': {
      title: 'ČÁST I',
      subtitle: 'Příjezd do hotelu',
      tone: 'První nesrovnalosti v případu 214.',
      revealTitle: 'První souvislost',
      revealText:
        'Pět místností ti dalo pět stop.\nKaždá z nich vede zpátky k pokoji 214.\nKlíč, zápisník, menu, účet i fotografie dohromady skládají první část případu.\nHotel je plný hostů, ale starý případ se právě otevírá.',
      revealCta: 'Pokračovat v případu',
    },
    'chapter-02-exploration': {
      title: 'ČÁST II',
      subtitle: 'Prozkoumávání hotelu',
      tone: 'Trasa vede mimo část pro hosty.',
      revealTitle: 'Skrytá trasa',
      revealText:
        'Druhá část pátrání tě zavedla mimo běžné prostory hotelu.\nVýpůjční lístek, seznam hostů a oříznutá fotografie ukázaly, že případ sahá dál než k pokoji 214.\nÚtržek mapy tě dovedl k bočnímu schodišti a klíč od zázemí otevřel dveře, které na plánku hotelu chybí.\nUž víš, že by ses měl vrátit.\nJenže teď jsi k pravdě blíž než kdy dřív.',
      revealCta: 'Pokračovat v případu',
    },
    'chapter-03-staff-area': {
      title: 'ČÁST III',
      subtitle: 'Skrytá trasa',
      tone: 'Stopy vedou do zázemí hotelu.',
      revealTitle: 'Zázemí personálu',
      revealText:
        'Stopy už nevedou jen k hostům.\nPoznámkový list, záznam hovoru, lístek z kabátu i noční rozpis ukazují, že někdo z personálu věděl víc, než přiznal.\nSlužební výtah tě navíc zavedl k patru, které na hotelové mapě vůbec neexistuje.\nVracíš se do pokoje.\nRáno chceš kontaktovat místní policii.\nJenže čím víc stop máš, tím jasnější je, že případ někdo pečlivě ukryl.',
      revealCta: 'Pokračovat v případu',
    },
    'chapter-04-shift-name': {
      title: 'ČÁST IV',
      subtitle: 'Jméno v záznamech',
      tone: 'V záznamech se začíná opakovat stejné jméno.',
      revealTitle: 'Shoda jmen',
      revealText:
        'Případ se začíná skládat.\nVýpis hostů, uzavřený doklad, náhradní klíč, rozpis směn i diář personálu ukazují stejným směrem.\nZmizelí hosté podle záznamů odjeli, ale jejich stopy končí uvnitř hotelu.\nNěkdo jejich pobyty uzavřel.\nNěkdo měl přístup k pokoji 214.\nA někdo se postaral, aby to celé vypadalo jako náhoda.',
      revealCta: 'Pokračovat v případu',
    },
    'chapter-05-case-214': {
      title: 'ČÁST V',
      subtitle: 'Případ 214',
      tone: 'Posledních pět místností skládá celý obraz.',
      revealTitle: 'Případ 214',
      revealText:
        'Stopy se znovu vrací k pokoji 214.\nStará mapa, nouzové osvětlení, zapomenutý kufr, osobní zápisník i svědectví ukázaly část hotelu, která měla zůstat skrytá.\nUzavřené křídlo nebylo prázdné. A pokoj 214 nebyl jen pokoj.\nByl to bod, ke kterému vedly všechny cesty.',
      revealCta: 'Předat stopy',
    },
  },
  rooms: {
    'room-01': {
      locationName: 'Recepce',
      shortDescription: 'U čísla 214 je prázdný háček.',
      detailText:
        'Recepce je připravená na nové hosty.\nNa stěně za pultem visí klíče od pokojů. Háček u čísla 214 je prázdný.\nRecepční chvíli hledá, pak tě požádá, abys počkal.',
      clueTitle: 'Klíč pokoje 214',
      clueDescription:
        'Recepční se po chvíli vrátí s klíčem od pokoje 214.\nNašla ho v zadní přihrádce staré skříňky.\nNa štítku je původní datum otevření hotelu.\nPo rekonstrukci měl být dávno vyřazený.\nNěkdo ho tu ale nechal.',
    },
    'room-02': {
      locationName: 'Pokoj 214',
      shortDescription: 'Na psacím stole nacházíš hotelový zápisník.',
      detailText:
        'Pokoj je pro tebe připravený. Čisté povlečení, zavřená okna a lahodný čaj, který ti nechali připravit.\nNa psacím stole nacházíš hotelový zápisník, který nevypadá, jako by tam patřil.',
      clueTitle: 'Hotelový zápisník',
      clueDescription:
        'Na prvních stránkách nacházíš běžné instrukce pro hotelové hosty. Na poslední straně tě překvapí, že část stránky chybí. Na tvrdých deskách deníku objevuješ několik vyrytých dat.\nJedno z nich se shoduje s datem zmizení uvedeným ve starém článku.',
    },
    'room-03': {
      locationName: 'Hotelová restaurace',
      shortDescription: 'Některá menu se liší od ostatních.',
      detailText:
        'Přesouváš se do hotelové restaurace.\nChystá se tu první večeře po znovuotevření hotelu.\nStoly jsou prostřené, jako by měli hosté každou chvíli přijít.\nU jednoho z nich leží staré jídelní menu.\nNa první pohled sem nepatří.',
      clueTitle: 'Původní jídelní menu',
      rewardTitle: 'Staré menu',
      clueDescription:
        'Na okraji starého menu je ručně připsaná značka.\nZkoušíš ji rozluštit a po chvíli v ní rozeznáš číslo stolu.\nPodle starých článků právě tam naposledy seděl jeden ze zmizelých hostů.',
    },
    'room-04': {
      locationName: 'Lobby bar',
      shortDescription: 'Účet z baru je vystavený na pokoj 214.',
      detailText:
        'Večer v hotelu ještě nekončí.\nZ restaurace se přesouváš do lobby baru.\nVe vzduchu se mísí vůně leštěného dřeva a brandy.\nNa chvíli máš pocit, že slyšíš smích dávných hostů.\nU prázdného stolu leží sklenice a účet.',
      clueTitle: 'Účet z baru',
      clueDescription:
        'Bereš účet do ruky.\nMezi skvrnami od brandy rozeznáš číslo pokoje 214.\nPapír je starý, ale někdo ho nechal přímo na stole.\nDatum odpovídá večeru, kdy byl jeden z hostů viděn naposledy.',
    },
    'room-05': {
      locationName: 'Zimní zahrada',
      shortDescription: 'Na jedné fotografii je poškrábaný obličej.',
      detailText:
        'Ráno snídáš v zimní zahradě.\nJe tu klid. Většina hostů ještě spí.\nNa zdi visí fotografie ze znovuotevření hotelu.\nMezi nimi si všimneš jedné starší fotky v poškrábaném rámu.\nNa první pohled sem nepatří.',
      clueTitle: 'Stará fotografie',
      clueDescription:
        'Sundáš fotografii ze zdi a otočíš ji.\nNa zadní straně jsou rukou napsaná čísla.\nMezi nimi se znovu objevuje 214.\nTentokrát není u pokoje, ale u jména jednoho ze zmizelých hostů.',
    },
    'room-06': {
      locationName: 'Hotelová knihovna',
      shortDescription: 'Jeden výpůjční lístek je založený u knihy o historii hotelu.',
      detailText:
        'V jedné z postranních chodeb objevíš malou hotelovou knihovnu.\nPůsobí tiše a pečlivě uspořádaně, jako by ji někdo udržoval i během let, kdy byl hotel zavřený.\nMezi knihami najdeš starý katalog výpůjček.\nJeden lístek je založený u knihy o historii hotelu.',
      clueTitle: 'Výpůjční lístek',
      clueDescription:
        'Na lístku je jméno jednoho ze zmizelých hostů.\nPoznáváš ho z fotografie, kterou jsi našel v zimní zahradě.\nPodle záznamu byla kniha vrácená až po jeho zmizení.',
    },
    'room-07': {
      locationName: 'Banketní sál',
      shortDescription: 'Na klavíru leží připomínková knížka.',
      detailText:
        'Večer se přesouváš do banketního sálu.\nMístností zní tiché piano a hosté se baví u sklenek brandy.\nNa klavíru leží stará kniha hostů.\nMezi stránkami najdeš vložený seznam z jedné hotelové akce.',
      clueTitle: 'Seznam hostů',
      clueDescription:
        'V seznamu poznáváš několik jmen ze starých článků.\nPatřila hostům, kteří později zmizeli.\nStopa tě poprvé vede mimo pokoj 214.\nNěkteří byli naposledy viděni právě během hotelových akcí.',
    },
    'room-08': {
      locationName: 'Hotelová galerie',
      shortDescription: 'Jedna fotografie je cíleně oříznutá.',
      detailText:
        'Cestou zpět procházíš hotelovou galerií.\nChodbu lemují fotografie hotelu z různých období.\nNa jedné z nich se zastavíš.\nJe oříznutá nešikovně, jako by z ní někdo cíleně odstranil víc než jen okraj.\nNa zbytku snímku je vidět část hotelového personálu.',
      clueTitle: 'Oříznutá fotografie',
      clueDescription:
        'Zkoumáš fotografii pozorněji.\nNa uniformě jednoho ze zaměstnanců si všimneš drobného odznaku.\nStejný odznak se objevuje i na dalších starých snímcích.\nNěkdo z personálu byl u hotelových událostí častěji, než by se očekávalo.',
    },
    'room-09': {
      locationName: 'Boční schodiště',
      shortDescription: 'Boční schodiště na mapě chodby není zakreslené.',
      detailText:
        'Chodba druhého patra vede kolem pokojů pro hosty.\nNa jejím konci je pokoj 214.\nKdyž se k němu blížíš, všimneš si nenápadného bočního schodiště.\nNesvítí u něj světlo a na hotelové mapě není zakreslené.\nNa zemi pod rámem mapy leží utržený kousek papíru.',
      clueTitle: 'Útržek mapy',
      clueDescription:
        'Narovnáš utržený papír a zkoušíš doplnit chybějící část plánku.\nUkazuje trasu od pokojů k bočnímu schodišti.\nNa oficiální mapě hotelu ale tahle cesta chybí.\nNěkdo ji z plánku odstranil záměrně.',
    },
    'room-10': {
      locationName: 'Skryté schodiště',
      shortDescription: 'Na zábradlí si všimneš kovové cedulky s klíčem.',
      detailText:
        'Nedá ti to. Do pokoje se ještě vracet nechceš.\nVstoupíš na boční schodiště, které na hotelové mapě chybělo.\nJe úzké, tmavé a vede do části hotelu, kam hosté běžně nechodí.\nNa zábradlí visí malý klíč s kovovou cedulkou.',
      clueTitle: 'Klíč od zázemí',
      clueDescription:
        'Schodiště tě dovede k úzkým dveřím.\nJsou zamčené.\nZkusíš klíč, který visel u zábradlí.\nZámek po chvíli povolí.\nVcházíš dovnitř.',
    },
    'room-11': {
      locationName: 'Hotelová kancelář',
      shortDescription: 'Z jedné složky vykukuje poznámkový list.',
      detailText:
        'Za dveřmi ze zázemí objevíš hotelovou kancelář.\nNa stole leží šanony, provozní záznamy a rozházené poznámky.\nMístnost působí opuštěně, ale ne prázdně.\nZ jedné složky vykukuje čerstvě popsaný list.',
      clueTitle: 'Poznámkový list',
      clueDescription:
        'Inkoust na poznámce ještě úplně nezaschl.\nRukopis je těžko čitelný, ale rozeznáš několik slov.\n„214“, „hosté“ a „nepouštět dál“.\nNěkdo tu byl krátce před tebou.',
    },
    'room-12': {
      locationName: 'Telefonní ústředna',
      shortDescription: 'Hledáš telefon k pokoji 214.',
      detailText:
        'Z vedlejší místnosti se ozývá tiché zvonění telefonu.\nVejdeš dovnitř a ocitneš se u staré hotelové ústředny.\nStěny lemují kabely, přepínače a zaprášené telefony.\nÚstředna se už roky nepoužívá, přesto tu zůstaly záznamy hovorů.\nZačneš hledat číslo pokoje 214.',
      clueTitle: 'Záznam hovoru',
      clueDescription:
        'V záznamech najdeš hovor z pokoje 214.\nProběhl pozdě večer a opakoval se ještě ráno.\nJenže pokoj 214 měl být po prvním zmizení uzavřený.\nZ toho pokoje neměl volat nikdo.',
    },
    'room-13': {
      locationName: 'Prádelna',
      shortDescription: 'Mezi starými policemi si všimneš štítku z kabátu.',
      detailText:
        'V hloubi hotelového zázemí najdeš prádelnu.\nNa ramínkách tu visí uniformy a staré kabáty personálu.\nVětšina věcí působí nově, ale jeden kabát je výrazně starší než ostatní.\nZ jeho kapsy vykukuje malý papírový lístek.',
      clueTitle: 'Lístek z kabátu',
      clueDescription:
        'Vytáhneš lístek z kapsy starého kabátu.\nJe na něm napsané číslo pokoje 214.\nKabát ale nepatřil hostovi. Visel mezi věcmi hotelového personálu.\nNěkdo ze zaměstnanců měl k pokoji blíž, než by měl mít.',
    },
    'room-14': {
      locationName: 'Kuchyňská chodba',
      shortDescription: 'Na nástěnce zůstal starý noční rozpis.',
      detailText:
        'Z chodby zaslechneš tichý kovový zvuk.\nVydáš se za ním a ocitneš se v úzké chodbě za hotelovou kuchyní.\nSpojuje restauraci se zázemím a v noci by sem měl mít přístup jen personál.\nNa nástěnce visí starý noční rozpis služeb.',
      clueTitle: 'Noční rozpis',
      clueDescription:
        'Procházíš rozpis služeb z noci, kdy zmizel jeden z prvních hostů.\nVedle jednoho času je ručně dopsaná poznámka.\nJe krátká a nedokončená, jako by pisatele někdo vyrušil.\nPřečteš jen několik slov: „214“, „schodiště“ a „nechodit sám“.',
    },
    'room-15': {
      locationName: 'Služební výtah',
      shortDescription: 'Ovládání uvnitř vypadá, že bylo nedávno používáno.',
      detailText:
        'Na konci kuchyňské chodby si všimneš služebního výtahu.\nJe schovaný za úzkými dveřmi v zadní části zázemí.\nPodle cedule měl být roky mimo provoz.\nOvládací panel je ale čistý, jako by se ho někdo nedávno dotýkal.\nVedle výtahu visí starý servisní záznam.',
      clueTitle: 'Servisní záznam',
      clueDescription:
        'V servisním záznamu najdeš několik nedávných zápisů.\nVýtah měl být mimo provoz, ale někdo ho přesto používal.\nPoslední jízda vede do patra, které není na hotelové mapě.\nNež stihneš zjistit víc, z chodby zaslechneš kroky.\nVracíš se zpátky do pokoje.',
    },
    'room-16': {
      locationName: 'Archiv hostů',
      shortDescription: 'Rozhodneš se projít archiv hostů sám.',
      detailText:
        'Další den čekáš na odpověď z policie.\nNepřichází.\n\nRozhodneš se proto projít záznamy hostů sám.\nV jedné z místností pro personál najdeš starý archiv příjezdů a odjezdů.\nMezi složkami je založený výpis z období prvních zmizení.',
      clueTitle: 'Výpis hostů',
      clueDescription:
        'Procházíš staré záznamy řádek po řádku.\nU několika hostů se opakuje stejný čas příjezdu i odjezdu.\nNevypadá to jako náhoda.\nStejná jména poznáváš z fotografie ze zimní zahrady.\nByli v hotelu ve stejnou dobu. Jen podle záznamů každý zvlášť.',
    },
    'room-17': {
      locationName: 'Doklady hostů',
      shortDescription: 'Potřebuješ se dostat i k dokladům hostů.',
      detailText:
        'Samotné časy příjezdů a odjezdů ti nestačí.\nPotřebuješ zjistit, jak byly pobyty zmizelých hostů uzavřené.\n\nV hotelové evidenci najdeš složku se starými účty a doklady.\nNěkolik z nich patří jménům, která už znáš ze seznamu i fotografie.\nJeden doklad je založený zvlášť.',
      clueTitle: 'Uzavřený doklad',
      clueDescription:
        'Doklad je označený jako uzavřený.\nChybí na něm potvrzení hosta při odjezdu.\nStejný vzor se opakuje u dalších zmizelých.\nNěkdo jejich pobyty uzavřel za ně.',
    },
    'room-18': {
      locationName: 'Sklad klíčů',
      shortDescription: 'Potřebuješ ze skladu klíčů získat ten správný.',
      detailText:
        'Potřebuješ se dostat do zázemí recepce.\nPřes den by tě tam někdo snadno zahlédl.\n\nVšiml sis, že místnost se na noc zamyká.\nVe skladu klíčů proto hledáš ten správný.\nNěkteré štítky jsou nové, jiné někdo otočil číslem ke zdi.',
      clueTitle: 'Náhradní klíč',
      clueDescription:
        'Klíč odemkne dveře do zázemí recepce.\nZ jedné strany je označený jako náhradní.\nNa druhé straně ale zůstalo vyškrábané číslo.\nNedokážeš ho přečíst celé, ale připomíná číslo pokoje.\nNěkdo ten klíč přeznačil.',
    },
    'room-19': {
      locationName: 'Místnost personálu',
      shortDescription: 'Na stole se válely rozpisy směn.',
      detailText:
        'V zázemí recepce najdeš dveře do místnosti personálu.\nNa stole leží rozpisy směn, poznámky a staré provozní záznamy.\nZačneš hledat dny, kdy zmizeli hoteloví hosté.\nU nočních služeb se několik jmen opakuje nápadně často.',
      clueTitle: 'Rozpis směn',
      clueDescription:
        'Porovnáváš směny s daty zmizení.\nU každé noci se opakují stejná jména.\nTihle lidé museli být tehdy u výslechu.\nPřesto se jejich spojitost v článcích nikdy neobjevila.',
    },
    'room-20': {
      locationName: 'Kancelář správce',
      shortDescription: 'Potřebuješ něco osobního, co patří přímo personálu.',
      detailText:
        'Služební výtah musel někam vést.\nDalší noc se proto vracíš do zázemí hotelu.\nZa jedněmi zamčenými dveřmi objevíš kancelář, která na plánku hotelu chybí.\nNa stole leží osobní diář jednoho ze zaměstnanců.\nNěkolik stránek je vytržených.',
      clueTitle: 'Diář personálu',
      clueDescription:
        'Diář není úplný. Několik stran někdo vytrhl.\nNa zbylých stránkách zůstaly časy, které se shodují se zmizeními hostů.\nU jednoho záznamu se znovu objevuje číslo 214.\nTentokrát vedle iniciál zaměstnance.',
    },
    'room-21': {
      locationName: 'Stará mapa',
      shortDescription: 'Na dveřích najdeš starou mapu hotelu.',
      detailText:
        'V noci se vracíš do kanceláře správce.\nSlužební výtah musel vést dál, než ukazovala oficiální mapa hotelu.\nV zásuvce pod stolem najdeš starý plán budovy.\nVýtah je na něm zakreslený jinak než na mapách pro hosty.\nVedle jeho šachty je ručně dopsaná číselná kombinace.',
      clueTitle: 'Stará mapa',
      clueDescription:
        'Porovnáváš starý plán s tím, co už víš o služebním výtahu.\nČíselná kombinace nepatří k žádnému běžnému patru.\nZadáš ji do ovládacího panelu.\nVýtah se po chvíli rozjede.\nMíří do části hotelu, která na mapách pro hosty neexistuje.',
    },
    'room-22': {
      locationName: 'Strojovna výtahu',
      shortDescription: 'Strojovna je chladná a tmavá.',
      detailText:
        'Výtah se dává do pohybu.\nNevíš, kde zastaví ani co tě čeká za dveřmi.\n\nPo chvíli se kabina otřese a zůstane stát.\nDveře se otevřou do chladné strojovny.\nJe tu tma, kovový pach a tiché hučení starého mechanismu.\nNa stěně zahlédneš skříňku s nouzovým osvětlením.',
      clueTitle: 'Nouzové osvětlení',
      clueDescription:
        'Zapneš nouzové osvětlení.\nSlabé světlo odkryje servisní chodbu za výtahem.\nV prachu na podlaze vidíš čerstvé stopy.\nNěkdo tudy prošel nedávno.',
    },
    'room-23': {
      locationName: 'Uzavřené křídlo',
      shortDescription: 'O tomhle v novinách nebyla ani zmínka.',
      detailText:
        'Ze strojovny vede úzká servisní chodba.\nNa jejím konci stojí těžké dveře bez označení.\n\nKdyž je otevřeš, vstoupíš do uzavřeného křídla hotelu.\nNa plánech pro hosty neexistuje a ve starých článcích o něm nebyla ani zmínka.\nV prachu u stěny leží zapomenutý kufr.',
      clueTitle: 'Zapomenutý kufr',
      clueDescription:
        'Kufr je zaprášený, ale ne tolik, jak by měl být po tolika letech.\nNěkdo s ním musel nedávno hýbat.\n\nNa cedulce rozeznáš jméno jednoho ze zmizelých hostů.\nStejné jméno už znáš z knihy hostů, dokladů i diáře personálu.\nNa druhé straně cedulky je číslo pokoje 214.',
    },
    'room-24': {
      locationName: 'Pokoj v zavřeném křídle',
      shortDescription: 'Na stole leží nějaký diář.',
      detailText:
        'V uzavřeném křídle najdeš malý pokoj.\nNepůsobí jako pokoj pro hosty. Spíš jako místo, kde někdo přespával stranou od ostatních.\nJe skromně zařízený: postel, stůl a stará lampa.\nNa stole leží osobní zápisník.',
      clueTitle: 'Osobní zápisník',
      clueDescription:
        'V zápisníku se opakují čísla pokojů, časy a jména hostů.\nRukopis se shoduje s diářem z kanceláře správce.\nNěkdo si vedl vlastní seznam mimo oficiální záznamy.\nZa dveřmi se ozvou kroky.',
    },
    'room-25': {
      locationName: 'Pokoj 214',
      shortDescription: 'Někdo se blíží. Potřebuješ se schovat.',
      detailText:
        'Za dveřmi se ozvou kroky.\nNěkdo jde chodbou uzavřeného křídla přímo k tobě.\n\nZhasneš lampu a rozhlédneš se po místnosti.\nNábytek je starý a křehký, nikam se nedá bezpečně schovat.\nPak si všimneš pootevřených dveří na konci chodby.\n\nNa zašlém štítku je číslo 214.',
      clueTitle: 'Svědectví',
      clueDescription:
        'Vklouzneš do pokoje 214 a zavřeš za sebou dveře.\nV zásuvce nočního stolku najdeš složené papíry.\nJe to svědectví jednoho ze zmizelých hostů.\nPopisuje skrytou trasu, služební výtah a člověka z personálu.\nKroky se zastaví přede dveřmi.',
    },
  },
};
