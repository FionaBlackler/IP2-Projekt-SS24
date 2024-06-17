import { useRef } from 'react';

const FocusExample = () => {
    const labelRef = useRef(null);

    const handleButtonClick = () => {
        // Focus on the label element
        labelRef.current.focus();

        // Scroll to the label element
        labelRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    };

    return (
        <div style={{ minHeight: '100vh', padding: '20px' }}>
            <button onClick={handleButtonClick}>Focus Label</button>
            <br />
            <br />
            <div style={{ height: '800px' }}>
                {/* Spacer to make the page scrollable */}
            </div>
            <br />
            <label ref={labelRef} tabIndex={0} style={{ padding: '20px', border: '1px solid black' }}>
                This label will be focused and scrolled to when the button is clicked.
            </label>
            <div>
                Geschichte
                Anfänge
                OpenAI, das Unternehmen hinter ChatGPT, wurde 2015 gegründet.[2] Das erste Sprachmodell, GPT-1, welches auf der 2017 erstmals vorgestellten Transformer-Architektur aufbaute, wurde im Juni 2018 eingeführt. Es bestand aus 117 Millionen vor-trainierten Parametern.[3] Die Anzahl der Parameter definiert u. a. die Leistungsfähigkeit eines KI-Modells, je höher deren Anzahl desto besser die Leistungsfähigkeit. Der im Februar 2019 gestartete Nachfolger, GPT-2 umfasste bereits 1,5 Milliarden Parameter. Aus Sorge vor Missbrauch wurde GPT-2 erst Ende 2019 für die Öffentlichkeit freigegeben.[4] GPT-3 folgte im Juni 2020 – es war mit 175 Milliarden Parametern trainiert worden und das erste Modell, das in der Lage war, umfassendere und unterschiedlichere Aufgaben zu bearbeiten; vom Verfassen von E-Mails und sonstigen Texten, über Übersetzungen, bis hin zur Erstellung von Programmcode.[5] Zudem war es erstmals in der Lage, umfassend Antworten zu frei formulierten Fragen von Nutzern zu generieren.[6][7]

                Boom 2022/2023
                Wie funktioniert ChatGPT-3.0? Erklärvideo (1 min 30)
                Nachdem OpenAI am 30. November 2022 eine verbesserte Version GPT-3.5, bekannt als ChatGPT, kostenfrei für die Öffentlichkeit freigab, registrierten sich innerhalb von nur fünf Tagen weltweit eine Million Nutzer.[8][9] Trotz der Limitierungen des Tools, wie etwa der fehlenden Verbindung zum offenen Internet, war das Interesse enorm. OpenAI hatte ChatGPT nur mit Inhalten bis September 2021 trainiert.[10] Aus diesem Grund konnte das Tool keine Abfragen zur Aktualität beantworten, eine Eigenschaft, die auch in der Basisversion des technisch deutlich leistungsfähigeren Nachfolgers GPT-4 bestehen bleibt.[11] Das starke öffentliche Interesse an der App erklärten sich Experten vor allem mit der sehr einfachen Nutzbarkeit: Erstmals konnten auch Laien weltweit mit KI interagieren, ohne Computerkenntnisse zu besitzen. Das Interface von ChatGPT war von Beginn an ähnlich einfach zu bedienen wie bei etablierten Web-Anwendungen wie Google oder WhatsApp.

                ChatGPT soll schon von Anbeginn im Vergleich zum Vorgänger InstructGPT darauf angelegt worden sein, schädliche und irreführende Antworten zu vermeiden. Dies lässt sich an einem Beispiel veranschaulichen: Während InstructGPT die Vorgabe in der Anfrage „Erzähle mir davon, wie Christoph Kolumbus 2015 in die USA kam“ als wahr wertet, nutzt ChatGPT Wissen über Kolumbusʼ Reisen und das bis zum Jahre 2021 erlernte Verständnis, um eine Antwort zu liefern, die annimmt, was geschehen wäre, wenn Kolumbus 2015 in den USA gelandet wäre.[12] Trotz der erheblichen Verbesserungen in ChatGPT im Vergleich zu seinem Vorgänger, war das Tool jedoch nicht frei von Fehlern und lieferte immer noch eine erhebliche Menge an Falschinformationen.[13] OpenAI unternahm große Anstrengungen, um die Genauigkeit und Zuverlässigkeit von ChatGPT zu verbessern und schädliche oder irreführende Antworten zu minimieren. Doch trotz dieser Bemühungen stellte sich heraus, dass das System immer noch anfällig für Missverständnisse und Inkonsistenzen in den Antworten war, was teilweise auf die Begrenzungen der Transformer-Architektur und der verfügbaren Trainingsdaten zurückzuführen ist.[14]

                Mit Updates vom 15. Dezember 2022 und 9. Januar 2023 sollten laut Herstellerangaben die Themenbereiche erweitert und die Korrektheit der Aussagen verbessert worden sein.[15] Ein Update am 30. Januar 2023 soll abermals die Korrektheit und die mathematischen Fähigkeiten verbessert haben.[16]

                Im Februar 2023 hielt der NEOS-Abgeordnete Niko Swatek im Landtag Steiermark eine Rede zum Thema Schulstraßen, die er von ChatGPT hatte schreiben lassen, wie er nach zwei weiteren Rednern bekanntgab.[17] Die erste von ChatGPT geschriebene Rede im Europaparlament hielt der Volt-Abgeordnete Damian Boeselager im Februar 2023. Boeselager ließ die Software eine Rede über die Regulierung von Künstlicher Intelligenz in Shakespeare-Englisch schreiben, um die Auswirkungen generativer Sprachmodelle in allen Bereichen der Arbeitswelt darzustellen.[18]

                Technische Weiterentwicklung
                Am 14. März 2023 erschien offiziell Version 4.0 von GPT, welche auch die Fähigkeiten von ChatGPT erweitern soll.[19] GPT-4 ermöglicht eine Bildeingabe und die Analyse und Beschreibung von Skizzen und Fotos. Es ist möglich, abfotografierte Aufgaben aus Büchern lösen zu lassen. Wissenschaftliche Arbeiten können hochgeladen werden, um eine Zusammenfassung generieren zu lassen. Examensprüfungen konnte GPT-4 bei Tests in den USA mit Auszeichnung erledigen und komplizierte Steuerfragen werden beantwortet.[20]

                Ende März 2023 startete OpenAI seinen Plugin-Store. Analog zu den vom Smartphone bekannten App Stores können Drittanbieter für den Plugin-Store eigene Apps entwickeln, die User dann nach eigenem Bedarf in GPT-4 integrieren. Diese Plugins ermöglichen diverse Spezialfunktionen, wie beispielsweise die Analyse von Websites auf ihre Suchmaschinenoptimierung, die Zusammenfassung von YouTube-Videos anhand ihrer Untertitel oder die Erstellung von spezifizierten Prompts für andere KI-Tools wie Midjourney. Auch bekannte Internet-Apps wie Expedia, Klarna oder Zapier entwickelten ChatGPT-Plugins.[21]

                Seit Frühjahr 2023 wurde berichtet, dass OpenAI an ChatGPT-5 arbeite. Sam Altman, der CEO von OpenAI, dementierte mehrmals Gerüchte, dass die neue Version kurz vor dem Start stünde. Unter anderem sagte er im April, dass sein Unternehmen GPT-5 noch nicht trainiere und dies auch kurzfristig nicht vorhabe.[22] Im Juli 2023 meldete OpenAI die Marke GPT-5 beim US-Patentamt an.[23] Experten mutmaßten im Sommer 2023 allerdings, dass als Zwischenschritt und Update des aktuellen Bots zunächst ein ChatGPT-4.5 auf den Markt kommen werde.[24]

                Am 25. September 2023 kündigte das Unternehmen Open AI zwei Erweiterungen der Fähigkeiten von ChatGPT an. Zusätzlich zu schriftlichen Anfragen (Prompts) wird auch Sprachkonversation möglich. Für die Spracheingabe wird das bereits vorhandene Spracherkennungssystem Whisper von Open AI genutzt. Für Sprachantworten wurde ein neues Text-zu-Sprache-Übersetzungsmodul entwickelt. Zusätzlich können auch Bilder eingegeben und über Sprache oder Text kommentiert und Fragen dazu gestellt werden. Die neuen Möglichkeiten erleichtern die Kommunikation mit ChatGPT. Die Neuerung wird vorerst nur für ChatGPT-Plus- und Enterprise-Nutzer bis Mitte Oktober 2023 verfügbar gemacht. Eine Namensgebung dieser Version ist nur bezüglich der Bildeingabe als GPT-4V (V=Vision)[25] definiert worden.[26] Kombinationen verschiedenartiger Eingabe- und Ausgabemöglichkeiten werden als multimodal bezeichnet.[27]

                Ein umfassendes Update folgte Anfang November 2023, ab 9. November auch für den deutschen Markt, als OpenAI zum einen die Datenbasis auf Stand April 2023 aktualisierte und zum anderen eigenständige „GPTs“ innerhalb von ChatGPT einführte. Mit einem als „GPT Builder“ bezeichneten Tool kann man seitdem selbst, ohne Programmierkenntnisse, Chatbots aufsetzen, die auf Basis festgelegter Voreinstellungen individuelle Aufgaben erledigen.[28]

                Im Januar 2024 startete OpenAI den GPT Store, über den Entwickler eigenständige GPTs veröffentlichen und vermarkten können. Voraussetzung ist ein GPT-4-Account (privat oder Enterprise).[29][30]

                Die nächste große Entwicklungsstufe stellte Mitte Mai 2024 das Model GPT-4o da. Das „o“ steht dabei für „omni“, lateinisch „alles“ und spielt darauf an, dass das Modell deutlich besser als die bisherigen alle Arten von Content in der Ein- und Ausgabe verwenden kann.[31] Dazu zählen ein optimiertes Sprachverständnis, das erstmals die Möglichkeit bietet, sich mit ChatGPT fast in Echtzeit zu unterhalten.[32] Auch die Erkennung von Bildern und Videos ist laut OpenAI deutlich verbessert worden. Das neue Modell steht, anders als bisher GPT-4, Usern kostenlos zur Verfügung, allerdings ist die Anzahl der Eingaben limitiert, wenn man die Gratis-Version von ChatGPT-4 nutzt.

                Kosten
                Am 10. Januar 2023 veröffentlichte OpenAI in seinem Discord-Kanal eine Warteliste für eine kostenpflichtige Version „ChatGPT Professional (experimental)“, in der auch Fragen zur Preissensibilität gestellt wurden.[33][34] Auf der ChatGPT-Website wirbt man dafür mit einem Zugang auch bei hoher Nachfrage, mit schnellerer Reaktionszeit und vorrangigem Zugang zu neuen Funktionen.[35]

                Anfang Februar 2023 startete in den USA die kostenpflichtige Professional-Version von ChatGPT.[36] Begonnen wurde mit einem Preis von 23,80 US-Dollar (22 €) pro Monat.[37] Nutzer in Deutschland erhielten mit der Veröffentlichung von GPT-4 im März 2023 Zugang zur Premiumversion und zahlen seither 20 US-Dollar pro Monat.[38] Umgerechnet sind dies etwa 18 € (Stand 11. Juli 2023).

                Mit der Veröffentlichung von GPT-4 im März 2023 kehrte sich OpenAI von einem Open-Source-Entwicklungsansatz mit kostenfreier Nutzung ab. Der OpenAI-Mitbegründer Ilya Sutskever begründete diesen Schritt neben Sicherheitsbedenken vor allem mit Wettbewerbsaspekten gegen andere Unternehmen der Branche.[39] Die Gründungsidee von OpenAI Inc., mit ChatGPT eine offene Alternative zu den marktbeherrschenden großen Technik-Konzernen zu schaffen, war damit infrage gestellt. Der Kritik, dass ohne Transparenz kaum mehr einschätzbar sei, mit welchen Risiken man es zu tun habe und wofür die Software sich eigne, begegnete man seitens OpenAI mit dem Hinweis, man werde im Sinne eines Ausgleichs der Interessen zwischen dem Unternehmen und der wissenschaftsbasierten Öffentlichkeit ausgewählten Dritten Zugang zu technischen Details gewähren.[40]

                Partnerschaft mit Microsoft
                Microsoft gab im Januar 2023 eine Partnerschaft mit OpenAI Global LLC bekannt, mit der Investitionen von zehn Milliarden US-Dollar einhergingen. Microsofts Cloud-Computing-Plattform Azure kommt exklusiv zum Einsatz.[41] Bis Mitte 2023 hat Microsoft insgesamt 13 Milliarden US-Dollar in das Unternehmen OpenAI Global LLC investiert und besitzt dadurch beinahe die Hälfte dessen Aktien.[42] Zudem plant der Konzern eine Integration in die Abo-Version der eigenen Office-Software.[43]

                Im Mai 2023 wurde die Datenbank der Suchmaschine Bing zur Nutzung in ChatGPT zur Verfügung gestellt. Zuvor hatte Microsoft bereits Funktionen von ChatGPT in die Suchmaschinen-Abfrage integriert. Vor der Verknüpfung mit der Bing-Datenbank hatte ChatGPT eine Datenbank auf dem Stand von September 2021 genutzt.[44] Die auch in Europa öffentlich frei zugängliche Kombination der Suchmaschine Bing mit ChatGPT wird neues Bing, Bing-Chat oder Bing AI genannt. Ein Vorteil gegenüber der ausschließlichen Nutzung von ChatGPT besteht darin, dass die verwendeten Suchmaschinenergebnisse durch aktuelle Quellenangaben belegt werden können.[42] OpenAI gab am 28. September 2023 ein neues Feature zum Internetzugriff frei. „Browsing with Bing“ soll fortan die Abfrage von Informationen aus dem Netz über die gleichnamige Microsoft-Suchmaschine auch Nutzern ermöglichen, welche im Übrigen nicht mit Microsoft-Software arbeiten. Die Funktion wurde zunächst nur Nutzern der Bezahlversion GPT-4 zur Verfügung gestellt.[45]

                In einem Gespräch mit dem Tagesspiegel erwiderte Microsoft-Gründer Bill Gates im Februar 2023 auf die Bemerkung, der Alltag mit der neuen KI-Software sei angesichts deren Fehlerträchtigkeit ernüchternd, dass es bis zur Lösung des Fehlerproblems noch „ein paar Jahre“ dauern werde. Es gebe aber keinen Weg zurück. „Die Milliarden, die in den Software- und Digitalunternehmen in diese Entwicklung fließen, sind größer als die Forschungsetats von Regierungen.“[46]
            </div>
        </div>
    );
};

export default FocusExample;
