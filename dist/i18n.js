/* Complete interface messages. Order: English, French, Spanish, Portuguese, Vietnamese, Korean; keys are German. */
(function(root){
'use strict';
const languages=['en','de','fr','es','pt','vi','ko'];
const columns=['en','fr','es','pt','vi','ko'];
const messages={
 "Sprache": [
  "Language",
  "Langue",
  "Idioma",
  "Idioma",
  "Ngôn ngữ",
  "언어"
 ],
 "Spieler": [
  "Players",
  "Joueurs",
  "Jugadores",
  "Jogadores",
  "Người chơi",
  "플레이어"
 ],
 "Spielerliste": [
  "Player list",
  "Liste des joueurs",
  "Lista de jugadores",
  "Lista de jogadores",
  "Danh sách người chơi",
  "플레이어 목록"
 ],
 "Öffnen": [
  "Open",
  "Ouvrir",
  "Abrir",
  "Abrir",
  "Mở",
  "열기"
 ],
 "Plan speichern": [
  "Save plan",
  "Enregistrer le plan",
  "Guardar plan",
  "Salvar plano",
  "Lưu sơ đồ",
  "계획 저장"
 ],
 "Exportieren": [
  "Export",
  "Exporter",
  "Exportar",
  "Exportar",
  "Xuất",
  "내보내기"
 ],
 "Plan als PNG-Bild": [
  "Plan as PNG image",
  "Plan en image PNG",
  "Plan como imagen PNG",
  "Plano como imagem PNG",
  "Sơ đồ dạng ảnh PNG",
  "PNG 이미지로 저장"
 ],
 "Plan als SVG-Grafik": [
  "Plan as SVG graphic",
  "Plan en graphique SVG",
  "Plan como gráfico SVG",
  "Plano como gráfico SVG",
  "Sơ đồ dạng đồ họa SVG",
  "SVG 그래픽으로 저장"
 ],
 "Koordinaten als CSV": [
  "Coordinates as CSV",
  "Coordonnées en CSV",
  "Coordenadas en CSV",
  "Coordenadas em CSV",
  "Tọa độ dạng CSV",
  "좌표를 CSV로 저장"
 ],
 "Namen einfügen": [
  "Paste names",
  "Coller les noms",
  "Pegar nombres",
  "Colar nomes",
  "Dán tên",
  "이름 붙여넣기"
 ],
 "Datei importieren": [
  "Import file",
  "Importer un fichier",
  "Importar archivo",
  "Importar arquivo",
  "Nhập tệp",
  "파일 가져오기"
 ],
 "TXT: ein Name pro Zeile. CSV: Namen mit Semikolon trennen.": [
  "TXT: one name per line. CSV: separate names with semicolons.",
  "TXT : un nom par ligne. CSV : séparer les noms par des points-virgules.",
  "TXT: un nombre por línea. CSV: separar nombres con punto y coma.",
  "TXT: um nome por linha. CSV: separar nomes com ponto e vírgula.",
  "TXT: mỗi dòng một tên. CSV: phân cách tên bằng dấu chấm phẩy.",
  "TXT: 한 줄에 이름 하나. CSV: 세미콜론으로 이름 구분."
 ],
 "Spieler suchen": [
  "Search players",
  "Rechercher des joueurs",
  "Buscar jugadores",
  "Buscar jogadores",
  "Tìm người chơi",
  "플레이어 검색"
 ],
 "Spieler suchen …": [
  "Search players…",
  "Rechercher des joueurs…",
  "Buscar jugadores…",
  "Buscar jogadores…",
  "Tìm người chơi…",
  "플레이어 검색…"
 ],
 "Spielerliste filtern": [
  "Filter player list",
  "Filtrer les joueurs",
  "Filtrar jugadores",
  "Filtrar jogadores",
  "Lọc danh sách người chơi",
  "플레이어 목록 필터"
 ],
 "Alle": [
  "All",
  "Tous",
  "Todos",
  "Todos",
  "Tất cả",
  "전체"
 ],
 "Ohne Platz": [
  "Unassigned",
  "Sans place",
  "Sin asignar",
  "Sem lugar",
  "Chưa có vị trí",
  "미배정"
 ],
 "Spieler zum Platzieren": [
  "Players to place",
  "Joueurs à placer",
  "Jugadores por colocar",
  "Jogadores para posicionar",
  "Người chơi cần xếp chỗ",
  "배치할 플레이어"
 ],
 "Freie Plätze automatisch füllen": [
  "Automatically fill empty seats",
  "Remplir les places libres automatiquement",
  "Rellenar plazas libres automáticamente",
  "Preencher lugares livres automaticamente",
  "Tự động lấp chỗ trống",
  "빈 자리 자동 배정"
 ],
 "Autofill": [
  "Autofill",
  "Remplissage auto",
  "Autorrellenar",
  "Preenchimento auto",
  "Tự động xếp",
  "자동 배정"
 ],
 "Freie Beacon-Plätze einbeziehen": [
  "Include empty beacon seats",
  "Inclure les places de balise libres",
  "Incluir plazas de baliza libres",
  "Incluir lugares de beacon livres",
  "Bao gồm chỗ Beacon còn trống",
  "빈 비콘 자리 포함"
 ],
 "Autofill belegt freie Plätze vom Allianzzentrum nach außen.": [
  "Autofill fills empty seats from the Alliance Center outwards.",
  "Le remplissage auto part du centre d’alliance vers l’extérieur.",
  "El autorrelleno ocupa plazas desde el centro de alianza hacia fuera.",
  "O preenchimento auto ocupa lugares do centro da aliança para fora.",
  "Tự động xếp chỗ từ Trung tâm Liên minh ra ngoài.",
  "자동 배정은 연맹 센터에서 가까운 빈 자리부터 채웁니다."
 ],
 "Füge zuerst Spieler hinzu.": [
  "Add players first.",
  "Ajoute d’abord des joueurs.",
  "Añade jugadores primero.",
  "Adicione jogadores primeiro.",
  "Hãy thêm người chơi trước.",
  "먼저 플레이어를 추가하세요."
 ],
 "Namen auf einen Platz ziehen. Oder einen Namen anklicken und danach den gewünschten Platz.": [
  "Drag a name onto a seat. Or click a name, then the desired seat.",
  "Glisse un nom sur une place. Ou clique sur un nom, puis sur la place souhaitée.",
  "Arrastra un nombre a una plaza. O pulsa un nombre y luego la plaza deseada.",
  "Arraste um nome para um lugar. Ou clique no nome e depois no lugar desejado.",
  "Kéo tên vào một vị trí. Hoặc nhấp tên rồi nhấp vị trí mong muốn.",
  "이름을 자리로 끌어 놓으세요. 또는 이름을 클릭한 뒤 원하는 자리를 클릭하세요."
 ],
 "Hive-Karte": [
  "Hive map",
  "Carte du hive",
  "Mapa del hive",
  "Mapa do hive",
  "Bản đồ Hive",
  "하이브 지도"
 ],
 "Planname": [
  "Plan name",
  "Nom du plan",
  "Nombre del plan",
  "Nome do plano",
  "Tên sơ đồ",
  "계획 이름"
 ],
 "Rückgängig": [
  "Undo",
  "Annuler",
  "Deshacer",
  "Desfazer",
  "Hoàn tác",
  "실행 취소"
 ],
 "Wiederholen": [
  "Redo",
  "Rétablir",
  "Rehacer",
  "Refazer",
  "Làm lại",
  "다시 실행"
 ],
 "Rückgängig (Strg+Z)": [
  "Undo (Ctrl+Z)",
  "Annuler (Ctrl+Z)",
  "Deshacer (Ctrl+Z)",
  "Desfazer (Ctrl+Z)",
  "Hoàn tác (Ctrl+Z)",
  "실행 취소 (Ctrl+Z)"
 ],
 "Wiederholen (Strg+Umschalt+Z)": [
  "Redo (Ctrl+Shift+Z)",
  "Rétablir (Ctrl+Maj+Z)",
  "Rehacer (Ctrl+Mayús+Z)",
  "Refazer (Ctrl+Shift+Z)",
  "Làm lại (Ctrl+Shift+Z)",
  "다시 실행 (Ctrl+Shift+Z)"
 ],
 "Element hinzufügen": [
  "Add element",
  "Ajouter un élément",
  "Añadir elemento",
  "Adicionar elemento",
  "Thêm đối tượng",
  "요소 추가"
 ],
 "Basis": [
  "Base",
  "Base",
  "Base",
  "Base",
  "Căn cứ",
  "기지"
 ],
 "Zentrum": [
  "Center",
  "Centre",
  "Centro",
  "Centro",
  "Trung tâm",
  "센터"
 ],
 "Marshall": [
  "Marshall",
  "Maréchal",
  "Mariscal",
  "Marechal",
  "Nguyên soái",
  "마샬"
 ],
 "Beacon": [
  "Beacon",
  "Balise",
  "Baliza",
  "Beacon",
  "Beacon",
  "비콘"
 ],
 "Terrain": [
  "Terrain",
  "Terrain",
  "Terreno",
  "Terreno",
  "Địa hình",
  "지형"
 ],
 "Eine weitere Basis platzieren": [
  "Place another base",
  "Placer une autre base",
  "Colocar otra base",
  "Posicionar outra base",
  "Đặt thêm căn cứ",
  "기지 추가 배치"
 ],
 "L4-Reichweiten": [
  "L4 coverage",
  "Portées L4",
  "Cobertura L4",
  "Alcance L4",
  "Phạm vi L4",
  "L4 범위"
 ],
 "Hive-Karte. Basis wählen und mit Pfeiltasten um ein Feld verschieben. Mit der Maus ziehen oder leere Karte verschieben.": [
  "Hive map. Select a base and move it one tile with the arrow keys. Drag elements or pan the empty map.",
  "Carte du hive. Sélectionne une base et déplace-la d’une case avec les flèches. Glisse les éléments ou déplace la carte vide.",
  "Mapa del hive. Selecciona una base y muévela una casilla con las flechas. Arrastra elementos o desplaza el mapa vacío.",
  "Mapa do hive. Selecione uma base e mova uma casa com as setas. Arraste elementos ou desloque o mapa vazio.",
  "Bản đồ Hive. Chọn căn cứ và dùng phím mũi tên để di chuyển một ô. Kéo đối tượng hoặc kéo vùng trống để di chuyển bản đồ.",
  "하이브 지도. 기지를 선택하고 방향키로 한 칸씩 이동하세요. 요소를 끌거나 빈 지도를 끌어 화면을 이동할 수 있습니다."
 ],
 "Platzieren abbrechen": [
  "Cancel placement",
  "Annuler le placement",
  "Cancelar colocación",
  "Cancelar posicionamento",
  "Hủy đặt vị trí",
  "배치 취소"
 ],
 "Abbrechen": [
  "Cancel",
  "Annuler",
  "Cancelar",
  "Cancelar",
  "Hủy",
  "취소"
 ],
 "Verkleinern": [
  "Zoom out",
  "Dézoomer",
  "Alejar",
  "Diminuir zoom",
  "Thu nhỏ",
  "축소"
 ],
 "Vergrößern": [
  "Zoom in",
  "Zoomer",
  "Acercar",
  "Aumentar zoom",
  "Phóng to",
  "확대"
 ],
 "Gesamten Hive anzeigen": [
  "Show the entire hive",
  "Afficher tout le hive",
  "Mostrar todo el hive",
  "Mostrar todo o hive",
  "Hiển thị toàn bộ Hive",
  "하이브 전체 보기"
 ],
 "Einpassen": [
  "Fit map",
  "Ajuster",
  "Ajustar",
  "Ajustar",
  "Vừa khung",
  "화면에 맞춤"
 ],
 "1 Rasterfeld = 1 Kartenfeld": [
  "1 grid tile = 1 map tile",
  "1 case de grille = 1 case de carte",
  "1 casilla de cuadrícula = 1 casilla del mapa",
  "1 casa da grade = 1 casa do mapa",
  "1 ô lưới = 1 ô bản đồ",
  "격자 한 칸 = 지도 한 칸"
 ],
 "Basis 3 × 3": [
  "Base 3 × 3",
  "Base 3 × 3",
  "Base 3 × 3",
  "Base 3 × 3",
  "Căn cứ 3 × 3",
  "기지 3 × 3"
 ],
 "Zentrum 9 × 9": [
  "Center 9 × 9",
  "Centre 9 × 9",
  "Centro 9 × 9",
  "Centro 9 × 9",
  "Trung tâm 9 × 9",
  "센터 9 × 9"
 ],
 "Mausrad: Zoom · Leere Karte ziehen: Ansicht verschieben": [
  "Mouse wheel: zoom · Drag empty map: pan",
  "Molette : zoom · Glisser la carte vide : déplacer la vue",
  "Rueda: zoom · Arrastrar mapa vacío: mover vista",
  "Roda: zoom · Arrastar mapa vazio: mover vista",
  "Con lăn: thu phóng · Kéo vùng trống: di chuyển bản đồ",
  "휠: 확대/축소 · 빈 지도 끌기: 화면 이동"
 ],
 "Plan und ausgewählter Platz": [
  "Plan and selected seat",
  "Plan et place sélectionnée",
  "Plan y plaza seleccionada",
  "Plano e lugar selecionado",
  "Sơ đồ và vị trí đã chọn",
  "계획 및 선택한 자리"
 ],
 "Allianzzentrum": [
  "Alliance Center",
  "Centre d’alliance",
  "Centro de alianza",
  "Centro da aliança",
  "Trung tâm Liên minh",
  "연맹 센터"
 ],
 "Marshall’s Guard": [
  "Marshall’s Guard",
  "Garde du maréchal",
  "Guardia del mariscal",
  "Guarda do marechal",
  "Cận vệ Nguyên soái",
  "마샬의 수호자"
 ],
 "Kartenkoordinaten der Gebäudemitte": [
  "Map coordinates of the building center",
  "Coordonnées du centre du bâtiment",
  "Coordenadas del centro del edificio",
  "Coordenadas do centro do edifício",
  "Tọa độ tâm công trình trên bản đồ",
  "건물 중심의 지도 좌표"
 ],
 "Koordinaten übernehmen": [
  "Apply coordinates",
  "Appliquer les coordonnées",
  "Aplicar coordenadas",
  "Aplicar coordenadas",
  "Áp dụng tọa độ",
  "좌표 적용"
 ],
 "Alle Spielerkoordinaten berechnen sich daraus. X steigt nach rechts, Y nach oben.": [
  "All player coordinates use this reference. X increases to the right, Y upwards.",
  "Toutes les coordonnées en dépendent. X augmente vers la droite, Y vers le haut.",
  "Todas las coordenadas usan esta referencia. X aumenta a la derecha, Y hacia arriba.",
  "Todas as coordenadas usam esta referência. X aumenta à direita, Y para cima.",
  "Mọi tọa độ người chơi dựa trên mốc này. X tăng sang phải, Y tăng lên trên.",
  "모든 플레이어 좌표의 기준입니다. X는 오른쪽, Y는 위쪽으로 증가합니다."
 ],
 "Zentrum ausgeblendet. Der markierte Ursprung bleibt die Referenz für alle Koordinaten.": [
  "Center hidden. The marked origin remains the reference for all coordinates.",
  "Centre masqué. L’origine marquée reste la référence de toutes les coordonnées.",
  "Centro oculto. El origen marcado sigue siendo la referencia de las coordenadas.",
  "Centro oculto. A origem marcada continua sendo a referência das coordenadas.",
  "Trung tâm đang ẩn. Gốc tọa độ được đánh dấu vẫn là mốc cho mọi tọa độ.",
  "센터가 숨겨져 있습니다. 표시된 원점이 모든 좌표의 기준으로 유지됩니다."
 ],
 "Startaufstellung": [
  "Starting layout",
  "Disposition initiale",
  "Formación inicial",
  "Formação inicial",
  "Đội hình ban đầu",
  "초기 배치"
 ],
 "Hive-Vorlage": [
  "Hive template",
  "Modèle de hive",
  "Plantilla de hive",
  "Modelo de hive",
  "Mẫu Hive",
  "하이브 템플릿"
 ],
 "100 Plätze · 1 Feld Abstand": [
  "100 seats · 1-tile gap",
  "100 places · écart de 1 case",
  "100 plazas · 1 casilla de separación",
  "100 lugares · intervalo de 1 casa",
  "100 vị trí · cách nhau 1 ô",
  "100자리 · 한 칸 간격"
 ],
 "100 Plätze · ohne Abstand": [
  "100 seats · no gaps",
  "100 places · sans espace",
  "100 plazas · sin separación",
  "100 lugares · sem intervalo",
  "100 vị trí · không có khoảng cách",
  "100자리 · 간격 없음"
 ],
 "Leere Karte": [
  "Empty map",
  "Carte vide",
  "Mapa vacío",
  "Mapa vazio",
  "Bản đồ trống",
  "빈 지도"
 ],
 "Vorlage anwenden": [
  "Apply template",
  "Appliquer le modèle",
  "Aplicar plantilla",
  "Aplicar modelo",
  "Áp dụng mẫu",
  "템플릿 적용"
 ],
 "Ausgewählter Platz": [
  "Selected seat",
  "Place sélectionnée",
  "Plaza seleccionada",
  "Lugar selecionado",
  "Vị trí đã chọn",
  "선택한 자리"
 ],
 "Wähle eine Basis, den Marshall oder ein anderes Element auf der Karte.": [
  "Select a base, the Marshall or another map element.",
  "Sélectionne une base, le maréchal ou un autre élément de la carte.",
  "Selecciona una base, el mariscal u otro elemento del mapa.",
  "Selecione uma base, o marechal ou outro elemento do mapa.",
  "Chọn căn cứ, Nguyên soái hoặc đối tượng khác trên bản đồ.",
  "지도에서 기지, 마샬 또는 다른 요소를 선택하세요."
 ],
 "Pläne werden als Datei gespeichert. Öffne die Datei später hier, um weiterzuplanen.": [
  "Plans are saved as files. Open the file here later to continue editing.",
  "Les plans sont enregistrés en fichiers. Rouvre le fichier ici pour continuer.",
  "Los planes se guardan como archivos. Abre el archivo aquí para seguir editando.",
  "Os planos são salvos em arquivos. Abra o arquivo aqui para continuar editando.",
  "Sơ đồ được lưu thành tệp. Mở lại tệp tại đây để tiếp tục chỉnh sửa.",
  "계획은 파일로 저장됩니다. 나중에 여기서 파일을 열어 계속 편집하세요."
 ],
 "Kurzanleitung": [
  "Quick guide",
  "Guide rapide",
  "Guía rápida",
  "Guia rápido",
  "Hướng dẫn nhanh",
  "간단 안내"
 ],
 "Schließen": [
  "Close",
  "Fermer",
  "Cerrar",
  "Fechar",
  "Đóng",
  "닫기"
 ],
 "Ein Spielername pro Zeile. Du kannst eine ganze Spalte aus Excel oder einer bestehenden Liste einfügen. Bereits vorhandene Namen bleiben erhalten.": [
  "One player name per line. Paste a column from Excel or an existing list. Existing names are preserved.",
  "Un nom par ligne. Colle une colonne Excel ou une liste existante. Les noms déjà présents sont conservés.",
  "Un nombre por línea. Pega una columna de Excel o una lista existente. Se conservan los nombres actuales.",
  "Um nome por linha. Cole uma coluna do Excel ou uma lista existente. Os nomes atuais são mantidos.",
  "Mỗi dòng một tên. Dán một cột từ Excel hoặc danh sách có sẵn. Các tên hiện tại được giữ nguyên.",
  "한 줄에 이름 하나를 입력하세요. Excel 열이나 기존 목록을 붙여넣을 수 있습니다. 기존 이름은 유지됩니다."
 ],
 "Spielernamen, ein Name pro Zeile": [
  "Player names, one per line",
  "Noms des joueurs, un par ligne",
  "Nombres de jugadores, uno por línea",
  "Nomes dos jogadores, um por linha",
  "Tên người chơi, mỗi dòng một tên",
  "플레이어 이름, 한 줄에 하나"
 ],
 "Noch keine Namen": [
  "No names yet",
  "Aucun nom pour le moment",
  "Aún no hay nombres",
  "Ainda sem nomes",
  "Chưa có tên",
  "아직 이름 없음"
 ],
 "Zur Liste hinzufügen": [
  "Add to list",
  "Ajouter à la liste",
  "Añadir a la lista",
  "Adicionar à lista",
  "Thêm vào danh sách",
  "목록에 추가"
 ],
 "Änderung übernehmen?": [
  "Apply change?",
  "Appliquer la modification ?",
  "¿Aplicar cambio?",
  "Aplicar alteração?",
  "Áp dụng thay đổi?",
  "변경 사항을 적용할까요?"
 ],
 "Übernehmen": [
  "Apply",
  "Appliquer",
  "Aplicar",
  "Aplicar",
  "Áp dụng",
  "적용"
 ],
 "Dein Hive, Platz für Platz": [
  "Your hive, seat by seat",
  "Ton hive, place par place",
  "Tu hive, plaza a plaza",
  "Seu hive, lugar por lugar",
  "Hive của bạn, từng vị trí một",
  "한 자리씩 만드는 나만의 하이브"
 ],
 "Wer sitzt wo?": [
  "Who sits where?",
  "Qui va où ?",
  "¿Quién va dónde?",
  "Quem fica onde?",
  "Ai ở đâu?",
  "누가 어디에 앉을까요?"
 ],
 "Füge deine Spielerliste ein und verteile die Namen auf der Karte. A–D sind als Beacon-Plätze markiert.": [
  "Add your player list and place names on the map. A–D mark the beacon seats.",
  "Ajoute les joueurs et place leurs noms sur la carte. A–D indiquent les places des balises.",
  "Añade jugadores y coloca sus nombres en el mapa. A–D marcan las plazas de baliza.",
  "Adicione jogadores e posicione os nomes no mapa. A–D marcam os lugares de beacon.",
  "Thêm danh sách người chơi và xếp tên lên bản đồ. A–D đánh dấu vị trí Beacon.",
  "플레이어 목록을 추가하고 지도에 배치하세요. A–D는 비콘 자리입니다."
 ],
 "Kein Spieler mit diesem Namen.": [
  "No player with this name.",
  "Aucun joueur de ce nom.",
  "No hay jugadores con ese nombre.",
  "Nenhum jogador com esse nome.",
  "Không có người chơi với tên này.",
  "해당 이름의 플레이어가 없습니다."
 ],
 "Alle Spieler haben einen Platz.": [
  "All players have a seat.",
  "Tous les joueurs ont une place.",
  "Todos los jugadores tienen plaza.",
  "Todos os jogadores têm um lugar.",
  "Mọi người chơi đều đã có vị trí.",
  "모든 플레이어에게 자리가 배정되었습니다."
 ],
 "Auf einen Platz ziehen": [
  "Drag onto a seat",
  "Glisser sur une place",
  "Arrastrar a una plaza",
  "Arrastar para um lugar",
  "Kéo vào một vị trí",
  "자리로 끌어 놓기"
 ],
 "Aus der Liste entfernen": [
  "Remove from list",
  "Retirer de la liste",
  "Quitar de la lista",
  "Remover da lista",
  "Xóa khỏi danh sách",
  "목록에서 제거"
 ],
 "{name} aus der Liste entfernen": [
  "Remove {name} from the list",
  "Retirer {name} de la liste",
  "Quitar a {name} de la lista",
  "Remover {name} da lista",
  "Xóa {name} khỏi danh sách",
  "목록에서 {name} 제거"
 ],
 "platziert auf X {x}, Y {y}": [
  "placed at X {x}, Y {y}",
  "placé en X {x}, Y {y}",
  "en X {x}, Y {y}",
  "em X {x}, Y {y}",
  "đã đặt tại X {x}, Y {y}",
  "X {x}, Y {y}에 배치됨"
 ],
 "noch ohne Platz": [
  "not yet assigned",
  "sans place pour le moment",
  "aún sin plaza",
  "ainda sem lugar",
  "chưa có vị trí",
  "아직 미배정"
 ],
 "Platz freihalten": [
  "Keep seat empty",
  "Garder la place libre",
  "Mantener plaza libre",
  "Manter lugar livre",
  "Giữ chỗ trống",
  "빈 자리로 유지"
 ],
 "bereits platziert": [
  "already placed",
  "déjà placé",
  "ya colocado",
  "já posicionado",
  "đã xếp chỗ",
  "이미 배치됨"
 ],
 "Name bearbeiten": [
  "Edit name",
  "Modifier le nom",
  "Editar nombre",
  "Editar nome",
  "Sửa tên",
  "이름 수정"
 ],
 "Bezeichnung": [
  "Label",
  "Libellé",
  "Etiqueta",
  "Nome do elemento",
  "Nhãn",
  "이름"
 ],
 "Terrainfläche auswählen": [
  "Select terrain area",
  "Sélectionner une zone de terrain",
  "Seleccionar área de terreno",
  "Selecionar área de terreno",
  "Chọn vùng địa hình",
  "지형 영역 선택"
 ],
 "Größe ändern": [
  "Resize",
  "Modifier la taille",
  "Cambiar tamaño",
  "Alterar tamanho",
  "Đổi kích thước",
  "크기 변경"
 ],
 "Breite (Felder)": [
  "Width (tiles)",
  "Largeur (cases)",
  "Ancho (casillas)",
  "Largura (casas)",
  "Rộng (ô)",
  "너비 (칸)"
 ],
 "Höhe (Felder)": [
  "Height (tiles)",
  "Hauteur (cases)",
  "Alto (casillas)",
  "Altura (casas)",
  "Cao (ô)",
  "높이 (칸)"
 ],
 "Größe übernehmen": [
  "Apply size",
  "Appliquer la taille",
  "Aplicar tamaño",
  "Aplicar tamanho",
  "Áp dụng kích thước",
  "크기 적용"
 ],
 "Je 1–60 Felder. Die Fläche wächst um ihre Mitte und rastet am Kartenraster ein. Terrain darf anderes Terrain überlappen. Gebäude bleiben frei.": [
  "1–60 tiles each. The area grows around its center and snaps to the grid. Terrain may overlap terrain. Buildings stay clear.",
  "1 à 60 cases par dimension. La zone s’étend autour de son centre et s’aligne sur la grille. Les terrains peuvent se chevaucher. Les bâtiments restent libres.",
  "De 1 a 60 casillas por dimensión. El área crece desde su centro y encaja en la cuadrícula. Los terrenos pueden solaparse. Los edificios quedan libres.",
  "De 1 a 60 casas por dimensão. A área cresce a partir do centro e se alinha à grade. Terrenos podem se sobrepor. Edifícios ficam livres.",
  "Mỗi chiều 1–60 ô. Vùng mở rộng quanh tâm và khớp vào lưới. Địa hình có thể chồng lên địa hình khác, nhưng không được đè lên công trình.",
  "각 변은 1–60칸입니다. 중심을 기준으로 크기가 바뀌고 격자에 맞춰집니다. 지형끼리는 겹칠 수 있지만 건물과는 겹칠 수 없습니다."
 ],
 "Karten-X": [
  "Map X",
  "X sur la carte",
  "X del mapa",
  "X do mapa",
  "X bản đồ",
  "지도 X"
 ],
 "Karten-Y": [
  "Map Y",
  "Y sur la carte",
  "Y del mapa",
  "Y do mapa",
  "Y bản đồ",
  "지도 Y"
 ],
 "Zum Zentrum: X {x} / Y {y}": [
  "From center: X {x} / Y {y}",
  "Par rapport au centre : X {x} / Y {y}",
  "Desde el centro: X {x} / Y {y}",
  "Em relação ao centro: X {x} / Y {y}",
  "So với trung tâm: X {x} / Y {y}",
  "센터 기준: X {x} / Y {y}"
 ],
 "Position übernehmen": [
  "Apply position",
  "Appliquer la position",
  "Aplicar posición",
  "Aplicar posição",
  "Áp dụng vị trí",
  "위치 적용"
 ],
 "Dieser Spieler ist ein Beacon": [
  "This player is a beacon",
  "Ce joueur est une balise",
  "Este jugador es una baliza",
  "Este jogador é um beacon",
  "Người chơi này là Beacon",
  "이 플레이어는 비콘입니다"
 ],
 "Markierung": [
  "Marker",
  "Repère",
  "Marcador",
  "Marcador",
  "Ký hiệu",
  "표식"
 ],
 "Elektriker": [
  "Electricians",
  "Électriciens",
  "Electricistas",
  "Eletricistas",
  "Thợ điện",
  "전기 기술자"
 ],
 "L4-Lichtbreite in Feldern": [
  "L4 light width in tiles",
  "Largeur de lumière L4 en cases",
  "Ancho de luz L4 en casillas",
  "Largura da luz L4 em casas",
  "Chiều rộng ánh sáng L4 theo ô",
  "L4 빛의 너비 (칸)"
 ],
 "Vollständige Fläche in einem L4-Lichtbereich.": [
  "Entire area inside one L4 light zone.",
  "Zone entière dans une seule portée L4.",
  "Área completa dentro de una zona de luz L4.",
  "Área inteira dentro de uma zona de luz L4.",
  "Toàn bộ diện tích nằm trong một vùng ánh sáng L4.",
  "전체 영역이 하나의 L4 빛 범위 안에 있습니다."
 ],
 "Die Fläche verteilt sich auf benachbarte Lichtbereiche. Buff-Symbol im Spiel prüfen.": [
  "Area spans adjacent light zones. Check the buff icon in-game.",
  "La zone couvre plusieurs portées voisines. Vérifie l’icône du bonus en jeu.",
  "El área abarca zonas de luz adyacentes. Comprueba el icono del beneficio en el juego.",
  "A área abrange zonas de luz vizinhas. Confira o ícone do bônus no jogo.",
  "Diện tích nằm trên các vùng ánh sáng liền kề. Hãy kiểm tra biểu tượng buff trong game.",
  "인접한 여러 빛 범위에 걸쳐 있습니다. 게임에서 버프 아이콘을 확인하세요."
 ],
 "Mittelpunkt im Licht, Teile der Fläche außerhalb.": [
  "Center in the light, parts of the area outside.",
  "Centre éclairé, une partie de la zone hors portée.",
  "Centro iluminado, parte del área fuera.",
  "Centro iluminado, parte da área fora.",
  "Tâm nằm trong ánh sáng, một phần diện tích nằm ngoài.",
  "중심은 빛 안에 있지만 일부 영역은 밖에 있습니다."
 ],
 "Außerhalb der L4-Lichtbereiche.": [
  "Outside L4 light zones.",
  "Hors des portées L4.",
  "Fuera de las zonas de luz L4.",
  "Fora das zonas de luz L4.",
  "Ngoài vùng ánh sáng L4.",
  "L4 빛 범위 밖에 있습니다."
 ],
 "Name lösen": [
  "Unassign player",
  "Libérer le joueur",
  "Desasignar jugador",
  "Desvincular jogador",
  "Bỏ xếp chỗ",
  "플레이어 배정 해제"
 ],
 "Element entfernen": [
  "Remove element",
  "Retirer l’élément",
  "Quitar elemento",
  "Remover elemento",
  "Xóa đối tượng",
  "요소 제거"
 ],
 "L4 individuell": [
  "Custom L4 ranges",
  "Portées L4 personnalisées",
  "Alcances L4 personalizados",
  "Alcances L4 personalizados",
  "Phạm vi L4 tùy chỉnh",
  "개별 L4 범위"
 ],
 "Ungespeicherte Änderungen": [
  "Unsaved changes",
  "Modifications non enregistrées",
  "Cambios sin guardar",
  "Alterações não salvas",
  "Thay đổi chưa lưu",
  "저장하지 않은 변경 사항"
 ],
 "Plan bereit": [
  "Plan ready",
  "Plan prêt",
  "Plan listo",
  "Plano pronto",
  "Sơ đồ sẵn sàng",
  "계획 준비됨"
 ],
 "Alle Spieler haben bereits einen Platz.": [
  "All players already have a seat.",
  "Tous les joueurs ont déjà une place.",
  "Todos los jugadores ya tienen plaza.",
  "Todos os jogadores já têm um lugar.",
  "Tất cả người chơi đã có vị trí.",
  "모든 플레이어가 이미 배정되었습니다."
 ],
 "Platz {n}": [
  "Seat {n}",
  "Place {n}",
  "Plaza {n}",
  "Lugar {n}",
  "Vị trí {n}",
  "자리 {n}"
 ],
 "Beacon {letter}": [
  "Beacon {letter}",
  "Balise {letter}",
  "Baliza {letter}",
  "Beacon {letter}",
  "Beacon {letter}",
  "비콘 {letter}"
 ],
 "9 × 9 Felder": [
  "9 × 9 tiles",
  "9 × 9 cases",
  "9 × 9 casillas",
  "9 × 9 casas",
  "9 × 9 ô",
  "9 × 9칸"
 ],
 "Ursprung X {x} / Y {y}": [
  "Origin X {x} / Y {y}",
  "Origine X {x} / Y {y}",
  "Origen X {x} / Y {y}",
  "Origem X {x} / Y {y}",
  "Gốc X {x} / Y {y}",
  "원점 X {x} / Y {y}"
 ],
 "{assigned} / {total} Plätze vergeben · {beacons} Beacons": [
  "{assigned} / {total} seats assigned · {beacons} beacons",
  "{assigned} / {total} places attribuées · {beacons} balises",
  "{assigned} / {total} plazas asignadas · {beacons} balizas",
  "{assigned} / {total} lugares atribuídos · {beacons} beacons",
  "Đã xếp {assigned} / {total} vị trí · {beacons} Beacon",
  "{assigned} / {total}자리 배정 · 비콘 {beacons}개"
 ],
 "{name}: gewünschten Platz anklicken": [
  "{name}: click the desired seat",
  "{name} : clique sur la place souhaitée",
  "{name}: pulsa la plaza deseada",
  "{name}: clique no lugar desejado",
  "{name}: nhấp vị trí mong muốn",
  "{name}: 원하는 자리를 클릭하세요"
 ],
 "{name}: auf die Karte klicken": [
  "{name}: click on the map",
  "{name} : clique sur la carte",
  "{name}: pulsa en el mapa",
  "{name}: clique no mapa",
  "{name}: nhấp vào bản đồ",
  "{name}: 지도를 클릭하세요"
 ],
 "{players} ohne Platz · {seats} freie Plätze.": [
  "{players} unassigned · {seats} empty seats.",
  "{players} sans place · {seats} places libres.",
  "{players} sin asignar · {seats} plazas libres.",
  "{players} sem lugar · {seats} lugares livres.",
  "{players} chưa có vị trí · {seats} chỗ trống.",
  "미배정 {players}명 · 빈 자리 {seats}개."
 ],
 "{n} Beacon-Plätze bleiben frei.": [
  "{n} beacon seats stay reserved.",
  "{n} places de balise restent réservées.",
  "{n} plazas de baliza siguen reservadas.",
  "{n} lugares de beacon ficam reservados.",
  "{n} vị trí Beacon được giữ trống.",
  "비콘 자리 {n}개는 비워 둡니다."
 ],
 "Mein Hive": [
  "My hive",
  "Mon hive",
  "Mi hive",
  "Meu hive",
  "Hive của tôi",
  "내 하이브"
 ],
 "Spieler / Element": [
  "Player / Element",
  "Joueur / Élément",
  "Jugador / Elemento",
  "Jogador / Elemento",
  "Người chơi / Đối tượng",
  "플레이어 / 요소"
 ],
 "Typ": [
  "Type",
  "Type",
  "Tipo",
  "Tipo",
  "Loại",
  "유형"
 ],
 "Platz": [
  "Seat",
  "Place",
  "Plaza",
  "Lugar",
  "Vị trí",
  "자리"
 ],
 "Erstellt {date}": [
  "Created {date}",
  "Créé le {date}",
  "Creado el {date}",
  "Criado em {date}",
  "Tạo ngày {date}",
  "생성일 {date}"
 ],
 "Unbekannte Vorlage.": [
  "Unknown template.",
  "Modèle inconnu.",
  "Plantilla desconocida.",
  "Modelo desconhecido.",
  "Mẫu không xác định.",
  "알 수 없는 템플릿입니다."
 ],
 "Dieser Platz liegt außerhalb des Planbereichs.": [
  "This position is outside the planning area.",
  "Cette position est hors de la zone du plan.",
  "Esta posición está fuera del área del plan.",
  "Esta posição fica fora da área do plano.",
  "Vị trí này nằm ngoài vùng lập sơ đồ.",
  "계획 영역 밖의 위치입니다."
 ],
 "Die Fläche überschneidet sich mit {name}.": [
  "The area overlaps {name}.",
  "La zone chevauche {name}.",
  "El área se solapa con {name}.",
  "A área se sobrepõe a {name}.",
  "Vùng này chồng lên {name}.",
  "영역이 {name}와 겹칩니다."
 ],
 "Element nicht gefunden.": [
  "Element not found.",
  "Élément introuvable.",
  "Elemento no encontrado.",
  "Elemento não encontrado.",
  "Không tìm thấy đối tượng.",
  "요소를 찾을 수 없습니다."
 ],
 "Alle Beacon-Buchstaben sind vergeben.": [
  "All beacon letters are in use.",
  "Toutes les lettres de balise sont utilisées.",
  "Todas las letras de baliza están en uso.",
  "Todas as letras de beacon estão em uso.",
  "Tất cả chữ cái Beacon đã được dùng.",
  "모든 비콘 문자가 사용 중입니다."
 ],
 "Unbekanntes Element.": [
  "Unknown element.",
  "Élément inconnu.",
  "Elemento desconocido.",
  "Elemento desconhecido.",
  "Đối tượng không xác định.",
  "알 수 없는 요소입니다."
 ],
 "Ein Plan kann höchstens 800 Elemente enthalten.": [
  "A plan can contain up to 800 elements.",
  "Un plan peut contenir 800 éléments maximum.",
  "Un plan admite hasta 800 elementos.",
  "Um plano pode conter até 800 elementos.",
  "Một sơ đồ chứa tối đa 800 đối tượng.",
  "계획에는 최대 800개의 요소를 넣을 수 있습니다."
 ],
 "Dieses Element ist bereits auf der Karte.": [
  "This element is already on the map.",
  "Cet élément est déjà sur la carte.",
  "Este elemento ya está en el mapa.",
  "Este elemento já está no mapa.",
  "Đối tượng này đã có trên bản đồ.",
  "이 요소는 이미 지도에 있습니다."
 ],
 "Bitte eine Textdatei im Format UTF-8 oder UTF-16 verwenden.": [
  "Please use a UTF-8 or UTF-16 text file.",
  "Utilise un fichier texte UTF-8 ou UTF-16.",
  "Usa un archivo de texto UTF-8 o UTF-16.",
  "Use um arquivo de texto UTF-8 ou UTF-16.",
  "Hãy dùng tệp văn bản UTF-8 hoặc UTF-16.",
  "UTF-8 또는 UTF-16 텍스트 파일을 사용하세요."
 ],
 "Bitte eine TXT- oder CSV-Datei auswählen.": [
  "Please select a TXT or CSV file.",
  "Sélectionne un fichier TXT ou CSV.",
  "Selecciona un archivo TXT o CSV.",
  "Selecione um arquivo TXT ou CSV.",
  "Hãy chọn tệp TXT hoặc CSV.",
  "TXT 또는 CSV 파일을 선택하세요."
 ],
 "Ein Spielername in der CSV darf keinen Zeilenumbruch enthalten.": [
  "A player name in the CSV cannot contain a line break.",
  "Un nom dans le CSV ne peut pas contenir de saut de ligne.",
  "Un nombre en el CSV no puede contener saltos de línea.",
  "Um nome no CSV não pode conter quebras de linha.",
  "Tên người chơi trong CSV không được chứa dấu xuống dòng.",
  "CSV의 플레이어 이름에는 줄바꿈을 넣을 수 없습니다."
 ],
 "CSV prüfen: Nach einem schließenden Anführungszeichen muss ein Semikolon oder Zeilenende folgen.": [
  "Check the CSV: a closing quote must be followed by a semicolon or line end.",
  "Vérifie le CSV : après un guillemet fermant, il faut un point-virgule ou une fin de ligne.",
  "Revisa el CSV: tras cerrar comillas debe haber un punto y coma o fin de línea.",
  "Verifique o CSV: após fechar aspas deve haver ponto e vírgula ou fim de linha.",
  "Kiểm tra CSV: sau dấu ngoặc kép đóng phải là dấu chấm phẩy hoặc cuối dòng.",
  "CSV를 확인하세요. 닫는 따옴표 뒤에는 세미콜론 또는 줄 끝이 와야 합니다."
 ],
 "CSV prüfen: Ein schließendes Anführungszeichen fehlt.": [
  "Check the CSV: a closing quote is missing.",
  "Vérifie le CSV : il manque un guillemet fermant.",
  "Revisa el CSV: faltan comillas de cierre.",
  "Verifique o CSV: faltam aspas de fechamento.",
  "Kiểm tra CSV: thiếu dấu ngoặc kép đóng.",
  "CSV를 확인하세요. 닫는 따옴표가 없습니다."
 ],
 "Die Textkodierung konnte nicht gelesen werden. Bitte die Datei als UTF-8 speichern.": [
  "The text encoding could not be read. Please save the file as UTF-8.",
  "L’encodage est illisible. Enregistre le fichier en UTF-8.",
  "No se pudo leer la codificación. Guarda el archivo como UTF-8.",
  "Não foi possível ler a codificação. Salve o arquivo como UTF-8.",
  "Không đọc được mã hóa văn bản. Hãy lưu tệp dưới dạng UTF-8.",
  "문자 인코딩을 읽을 수 없습니다. 파일을 UTF-8로 저장하세요."
 ],
 "Ein Name darf höchstens 80 Zeichen lang sein.": [
  "A name can have up to 80 characters.",
  "Un nom peut comporter 80 caractères maximum.",
  "Un nombre admite hasta 80 caracteres.",
  "Um nome pode ter até 80 caracteres.",
  "Tên dài tối đa 80 ký tự.",
  "이름은 최대 80자까지 가능합니다."
 ],
 "Die Liste kann höchstens 300 Spieler enthalten.": [
  "The list can contain up to 300 players.",
  "La liste peut contenir 300 joueurs maximum.",
  "La lista admite hasta 300 jugadores.",
  "A lista pode conter até 300 jogadores.",
  "Danh sách chứa tối đa 300 người chơi.",
  "목록에는 최대 300명의 플레이어를 넣을 수 있습니다."
 ],
 "Spieler können nur auf einer Basis sitzen.": [
  "Players can only be assigned to bases.",
  "Les joueurs ne peuvent être placés que sur des bases.",
  "Los jugadores solo se pueden asignar a bases.",
  "Jogadores só podem ser atribuídos a bases.",
  "Người chơi chỉ có thể được xếp vào căn cứ.",
  "플레이어는 기지에만 배정할 수 있습니다."
 ],
 "Spieler nicht gefunden.": [
  "Player not found.",
  "Joueur introuvable.",
  "Jugador no encontrado.",
  "Jogador não encontrado.",
  "Không tìm thấy người chơi.",
  "플레이어를 찾을 수 없습니다."
 ],
 "Dieser Platz ist bereits vergeben. Wähle einen freien Platz.": [
  "This seat is taken. Choose an empty seat.",
  "Cette place est occupée. Choisis une place libre.",
  "Esta plaza está ocupada. Elige una libre.",
  "Este lugar está ocupado. Escolha um lugar livre.",
  "Vị trí này đã có người. Hãy chọn chỗ trống.",
  "이미 배정된 자리입니다. 빈 자리를 선택하세요."
 ],
 "X und Y müssen ganze Zahlen von 0 bis 999999 sein.": [
  "X and Y must be whole numbers from 0 to 999999.",
  "X et Y doivent être des entiers de 0 à 999999.",
  "X e Y deben ser enteros de 0 a 999999.",
  "X e Y devem ser inteiros de 0 a 999999.",
  "X và Y phải là số nguyên từ 0 đến 999999.",
  "X와 Y는 0부터 999999 사이의 정수여야 합니다."
 ],
 "Breite: 1 bis 60 Felder.": [
  "Width: 1 to 60 tiles.",
  "Largeur : 1 à 60 cases.",
  "Ancho: de 1 a 60 casillas.",
  "Largura: de 1 a 60 casas.",
  "Chiều rộng: từ 1 đến 60 ô.",
  "너비: 1~60칸."
 ],
 "Höhe: 1 bis 60 Felder.": [
  "Height: 1 to 60 tiles.",
  "Hauteur : 1 à 60 cases.",
  "Alto: de 1 a 60 casillas.",
  "Altura: de 1 a 60 casas.",
  "Chiều cao: từ 1 đến 60 ô.",
  "높이: 1~60칸."
 ],
 "Beacon-Buchstabe: A bis Z.": [
  "Beacon letter: A to Z.",
  "Lettre de balise : A à Z.",
  "Letra de baliza: de A a Z.",
  "Letra de beacon: de A a Z.",
  "Chữ cái Beacon: từ A đến Z.",
  "비콘 문자: A~Z."
 ],
 "Dieser Beacon-Buchstabe ist bereits vergeben.": [
  "This beacon letter is already in use.",
  "Cette lettre de balise est déjà utilisée.",
  "Esta letra de baliza ya está en uso.",
  "Esta letra de beacon já está em uso.",
  "Chữ cái Beacon này đã được dùng.",
  "이미 사용 중인 비콘 문자입니다."
 ],
 "Lichtbreite: 1 bis 101 Felder.": [
  "Light width: 1 to 101 tiles.",
  "Largeur de lumière : 1 à 101 cases.",
  "Ancho de luz: de 1 a 101 casillas.",
  "Largura da luz: de 1 a 101 casas.",
  "Chiều rộng ánh sáng: từ 1 đến 101 ô.",
  "빛의 너비: 1~101칸."
 ],
 "Elektriker: 0 bis 100.": [
  "Electricians: 0 to 100.",
  "Électriciens : 0 à 100.",
  "Electricistas: de 0 a 100.",
  "Eletricistas: de 0 a 100.",
  "Thợ điện: từ 0 đến 100.",
  "전기 기술자: 0~100명."
 ],
 "Das ist keine unterstützte Hive-Plan-Datei.": [
  "This is not a supported hive plan file.",
  "Ce fichier de plan n’est pas pris en charge.",
  "Este archivo de plan no es compatible.",
  "Este arquivo de plano não é compatível.",
  "Tệp sơ đồ Hive này không được hỗ trợ.",
  "지원되는 하이브 계획 파일이 아닙니다."
 ],
 "Ungültiger Planname.": [
  "Invalid plan name.",
  "Nom de plan invalide.",
  "Nombre de plan no válido.",
  "Nome de plano inválido.",
  "Tên sơ đồ không hợp lệ.",
  "계획 이름이 올바르지 않습니다."
 ],
 "Ungültiger Koordinatenursprung.": [
  "Invalid coordinate origin.",
  "Origine des coordonnées invalide.",
  "Origen de coordenadas no válido.",
  "Origem das coordenadas inválida.",
  "Gốc tọa độ không hợp lệ.",
  "좌표 원점이 올바르지 않습니다."
 ],
 "Die Datei enthält zu viele oder ungültige Elemente.": [
  "The file contains too many or invalid elements.",
  "Le fichier contient trop d’éléments ou des éléments invalides.",
  "El archivo contiene demasiados elementos o elementos no válidos.",
  "O arquivo contém elementos demais ou inválidos.",
  "Tệp chứa quá nhiều đối tượng hoặc có đối tượng không hợp lệ.",
  "파일에 요소가 너무 많거나 올바르지 않은 요소가 있습니다."
 ],
 "Ungültige oder doppelte Spieler.": [
  "Invalid or duplicate players.",
  "Joueurs invalides ou en double.",
  "Jugadores no válidos o duplicados.",
  "Jogadores inválidos ou duplicados.",
  "Người chơi không hợp lệ hoặc bị trùng.",
  "올바르지 않거나 중복된 플레이어가 있습니다."
 ],
 "Ungültiges Kartenelement.": [
  "Invalid map element.",
  "Élément de carte invalide.",
  "Elemento de mapa no válido.",
  "Elemento de mapa inválido.",
  "Đối tượng bản đồ không hợp lệ.",
  "지도 요소가 올바르지 않습니다."
 ],
 "Ungültige Größe oder Position eines Elements.": [
  "Invalid element size or position.",
  "Taille ou position d’un élément invalide.",
  "Tamaño o posición de elemento no válidos.",
  "Tamanho ou posição de elemento inválidos.",
  "Kích thước hoặc vị trí đối tượng không hợp lệ.",
  "요소의 크기 또는 위치가 올바르지 않습니다."
 ],
 "Ungültige Basis-Einstellungen.": [
  "Invalid base settings.",
  "Paramètres de base invalides.",
  "Ajustes de base no válidos.",
  "Configurações de base inválidas.",
  "Cài đặt căn cứ không hợp lệ.",
  "기지 설정이 올바르지 않습니다."
 ],
 "Eine Spielerzuweisung ist ungültig oder doppelt.": [
  "A player assignment is invalid or duplicated.",
  "Une attribution de joueur est invalide ou en double.",
  "Una asignación de jugador no es válida o está duplicada.",
  "Uma atribuição de jogador é inválida ou duplicada.",
  "Có lượt xếp chỗ người chơi không hợp lệ hoặc bị trùng.",
  "플레이어 배정이 올바르지 않거나 중복되었습니다."
 ],
 "Ungültige oder doppelte Beacons.": [
  "Invalid or duplicate beacons.",
  "Balises invalides ou en double.",
  "Balizas no válidas o duplicadas.",
  "Beacons inválidos ou duplicados.",
  "Beacon không hợp lệ hoặc bị trùng.",
  "비콘이 올바르지 않거나 중복되었습니다."
 ],
 "Ungültiger Elementname.": [
  "Invalid element name.",
  "Nom d’élément invalide.",
  "Nombre de elemento no válido.",
  "Nome de elemento inválido.",
  "Tên đối tượng không hợp lệ.",
  "요소 이름이 올바르지 않습니다."
 ],
 "Zentrum und Koordinatenursprung stimmen nicht überein.": [
  "Center and coordinate origin do not match.",
  "Le centre et l’origine des coordonnées ne correspondent pas.",
  "El centro y el origen de coordenadas no coinciden.",
  "O centro e a origem das coordenadas não coincidem.",
  "Trung tâm và gốc tọa độ không khớp nhau.",
  "센터와 좌표 원점이 일치하지 않습니다."
 ],
 "Zentrum oder Marshall mehrfach vorhanden.": [
  "Multiple centers or Marshalls found.",
  "Plusieurs centres ou maréchaux sont présents.",
  "Hay varios centros o mariscales.",
  "Há vários centros ou marechais.",
  "Có nhiều trung tâm hoặc Nguyên soái.",
  "센터 또는 마샬이 여러 개 있습니다."
 ],
 "Die Änderung konnte nicht übernommen werden.": [
  "The change could not be applied.",
  "La modification n’a pas pu être appliquée.",
  "No se pudo aplicar el cambio.",
  "Não foi possível aplicar a alteração.",
  "Không thể áp dụng thay đổi.",
  "변경 사항을 적용할 수 없습니다."
 ],
 "Bitte gültige Koordinaten eingeben.": [
  "Please enter valid coordinates.",
  "Saisis des coordonnées valides.",
  "Introduce coordenadas válidas.",
  "Insira coordenadas válidas.",
  "Hãy nhập tọa độ hợp lệ.",
  "올바른 좌표를 입력하세요."
 ],
 "Der Name darf nicht leer sein.": [
  "The name cannot be empty.",
  "Le nom ne peut pas être vide.",
  "El nombre no puede estar vacío.",
  "O nome não pode ficar vazio.",
  "Tên không được để trống.",
  "이름을 비워 둘 수 없습니다."
 ],
 "Dieser Name steht bereits in der Liste.": [
  "This name is already on the list.",
  "Ce nom figure déjà dans la liste.",
  "Este nombre ya está en la lista.",
  "Este nome já está na lista.",
  "Tên này đã có trong danh sách.",
  "이미 목록에 있는 이름입니다."
 ],
 "Die Spielerliste ist zu groß (maximal 1 MB).": [
  "The player list is too large (maximum 1 MB).",
  "La liste est trop volumineuse (1 Mo maximum).",
  "La lista es demasiado grande (máximo 1 MB).",
  "A lista é muito grande (máximo de 1 MB).",
  "Danh sách quá lớn (tối đa 1 MB).",
  "플레이어 목록이 너무 큽니다 (최대 1MB)."
 ],
 "Die Datei enthält keine Spielernamen.": [
  "The file contains no player names.",
  "Le fichier ne contient aucun nom de joueur.",
  "El archivo no contiene nombres de jugadores.",
  "O arquivo não contém nomes de jogadores.",
  "Tệp không chứa tên người chơi.",
  "파일에 플레이어 이름이 없습니다."
 ],
 "Die Spielerliste konnte nicht gelesen werden.": [
  "The player list could not be read.",
  "La liste des joueurs n’a pas pu être lue.",
  "No se pudo leer la lista de jugadores.",
  "Não foi possível ler a lista de jogadores.",
  "Không thể đọc danh sách người chơi.",
  "플레이어 목록을 읽을 수 없습니다."
 ],
 "Die Plan-Datei ist zu groß (maximal 2 MB).": [
  "The plan file is too large (maximum 2 MB).",
  "Le fichier du plan est trop volumineux (2 Mo maximum).",
  "El archivo del plan es demasiado grande (máximo 2 MB).",
  "O arquivo do plano é muito grande (máximo de 2 MB).",
  "Tệp sơ đồ quá lớn (tối đa 2 MB).",
  "계획 파일이 너무 큽니다 (최대 2MB)."
 ],
 "Die Datei enthält kein gültiges Plan-JSON.": [
  "The file does not contain valid plan JSON.",
  "Le fichier ne contient pas de JSON de plan valide.",
  "El archivo no contiene un JSON de plan válido.",
  "O arquivo não contém JSON de plano válido.",
  "Tệp không chứa dữ liệu JSON sơ đồ hợp lệ.",
  "파일에 올바른 계획 JSON이 없습니다."
 ],
 "Das Plan-Bild konnte nicht erstellt werden. Bitte SVG verwenden.": [
  "The plan image could not be created. Please use SVG.",
  "L’image du plan n’a pas pu être créée. Utilise le SVG.",
  "No se pudo crear la imagen del plan. Usa SVG.",
  "Não foi possível criar a imagem do plano. Use SVG.",
  "Không thể tạo ảnh sơ đồ. Hãy dùng SVG.",
  "계획 이미지를 만들 수 없습니다. SVG를 사용하세요."
 ],
 "PNG-Export ist in diesem Browser nicht verfügbar.": [
  "PNG export is unavailable in this browser.",
  "L’export PNG n’est pas disponible dans ce navigateur.",
  "La exportación PNG no está disponible en este navegador.",
  "A exportação PNG não está disponível neste navegador.",
  "Trình duyệt này không hỗ trợ xuất PNG.",
  "이 브라우저에서는 PNG 내보내기를 사용할 수 없습니다."
 ],
 "PNG konnte nicht erstellt werden. Bitte SVG verwenden.": [
  "PNG could not be created. Please use SVG.",
  "Le PNG n’a pas pu être créé. Utilise le SVG.",
  "No se pudo crear el PNG. Usa SVG.",
  "Não foi possível criar o PNG. Use SVG.",
  "Không thể tạo PNG. Hãy dùng SVG.",
  "PNG를 만들 수 없습니다. SVG를 사용하세요."
 ],
 "Bitte dieses Feld ausfüllen.": [
  "Please fill in this field.",
  "Remplis ce champ.",
  "Completa este campo.",
  "Preencha este campo.",
  "Hãy điền trường này.",
  "이 항목을 입력하세요."
 ],
 "Bitte einen gültigen Wert eingeben.": [
  "Please enter a valid value.",
  "Saisis une valeur valide.",
  "Introduce un valor válido.",
  "Insira um valor válido.",
  "Hãy nhập giá trị hợp lệ.",
  "올바른 값을 입력하세요."
 ],
 "{name} ist bereits vorhanden. Du kannst das Element jetzt verschieben.": [
  "{name} already exists. You can now move the element.",
  "{name} existe déjà. Tu peux maintenant le déplacer.",
  "{name} ya existe. Ahora puedes mover el elemento.",
  "{name} já existe. Agora você pode mover o elemento.",
  "{name} đã có. Bạn có thể di chuyển đối tượng này.",
  "{name}가 이미 있습니다. 해당 요소를 이동할 수 있습니다."
 ],
 "Spieler zugeordnet.": [
  "Player assigned.",
  "Joueur attribué.",
  "Jugador asignado.",
  "Jogador atribuído.",
  "Đã xếp chỗ người chơi.",
  "플레이어를 배정했습니다."
 ],
 "Neue Basis platziert und Spieler zugeordnet.": [
  "New base placed and player assigned.",
  "Nouvelle base placée et joueur attribué.",
  "Nueva base colocada y jugador asignado.",
  "Nova base posicionada e jogador atribuído.",
  "Đã đặt căn cứ mới và xếp chỗ người chơi.",
  "새 기지를 배치하고 플레이어를 배정했습니다."
 ],
 "Terrain platziert. Breite und Höhe kannst du unter „Größe ändern“ anpassen.": [
  "Terrain placed. Adjust width and height under “Resize”.",
  "Terrain placé. Ajuste la largeur et la hauteur dans « Modifier la taille ».",
  "Terreno colocado. Ajusta ancho y alto en «Cambiar tamaño».",
  "Terreno posicionado. Ajuste largura e altura em “Alterar tamanho”.",
  "Đã đặt địa hình. Chỉnh chiều rộng và chiều cao trong “Đổi kích thước”.",
  "지형을 배치했습니다. ‘크기 변경’에서 너비와 높이를 조정하세요."
 ],
 "{name} platziert.": [
  "{name} placed.",
  "{name} placé.",
  "{name} colocado.",
  "{name} posicionado.",
  "Đã đặt {name}.",
  "{name} 배치 완료."
 ],
 "Spieler entfernen?": [
  "Remove player?",
  "Retirer le joueur ?",
  "¿Quitar jugador?",
  "Remover jogador?",
  "Xóa người chơi?",
  "플레이어를 제거할까요?"
 ],
 "{name} wird aus der Liste entfernt. Sein Platz wird wieder frei.": [
  "{name} will be removed from the list. Their seat becomes empty.",
  "{name} sera retiré de la liste. Sa place sera libérée.",
  "Se quitará a {name} de la lista. Su plaza quedará libre.",
  "{name} será removido da lista. Seu lugar ficará livre.",
  "{name} sẽ bị xóa khỏi danh sách. Vị trí của họ sẽ được bỏ trống.",
  "{name}가 목록에서 제거되고 해당 자리가 비워집니다."
 ],
 "Spieler entfernt.": [
  "Player removed.",
  "Joueur retiré.",
  "Jugador eliminado.",
  "Jogador removido.",
  "Đã xóa người chơi.",
  "플레이어를 제거했습니다."
 ],
 "Terraingröße angepasst.": [
  "Terrain size updated.",
  "Taille du terrain modifiée.",
  "Tamaño del terreno actualizado.",
  "Tamanho do terreno atualizado.",
  "Đã đổi kích thước địa hình.",
  "지형 크기를 변경했습니다."
 ],
 "Element entfernt. Strg+Z macht die Änderung rückgängig.": [
  "Element removed. Ctrl+Z undoes the change.",
  "Élément retiré. Ctrl+Z annule la modification.",
  "Elemento eliminado. Ctrl+Z deshace el cambio.",
  "Elemento removido. Ctrl+Z desfaz a alteração.",
  "Đã xóa đối tượng. Ctrl+Z để hoàn tác.",
  "요소를 제거했습니다. Ctrl+Z로 실행을 취소할 수 있습니다."
 ],
 "Der Spieler ist wieder ohne Platz.": [
  "The player is unassigned again.",
  "Le joueur n’a plus de place.",
  "El jugador vuelve a estar sin plaza.",
  "O jogador está sem lugar novamente.",
  "Người chơi lại chưa có vị trí.",
  "플레이어의 배정을 해제했습니다."
 ],
 "Koordinaten aktualisiert.": [
  "Coordinates updated.",
  "Coordonnées mises à jour.",
  "Coordenadas actualizadas.",
  "Coordenadas atualizadas.",
  "Đã cập nhật tọa độ.",
  "좌표를 변경했습니다."
 ],
 "{added} Spieler hinzugefügt. {skipped} doppelte Einträge übersprungen.": [
  "{added} players added. {skipped} duplicates skipped.",
  "{added} joueurs ajoutés. {skipped} doublons ignorés.",
  "{added} jugadores añadidos. {skipped} duplicados omitidos.",
  "{added} jogadores adicionados. {skipped} duplicados ignorados.",
  "Đã thêm {added} người chơi. Bỏ qua {skipped} mục trùng.",
  "플레이어 {added}명을 추가하고 중복 항목 {skipped}개를 건너뛰었습니다."
 ],
 "{assigned} Spieler von innen nach außen zugeordnet. {remaining} bleiben ohne Platz. Bestehende Zuweisungen bleiben erhalten.": [
  "{assigned} players assigned from the inside out. {remaining} remain unassigned. Existing assignments are preserved.",
  "{assigned} joueurs placés du centre vers l’extérieur. {remaining} restent sans place. Les attributions existantes sont conservées.",
  "{assigned} jugadores asignados de dentro hacia fuera. {remaining} siguen sin plaza. Se conservan las asignaciones existentes.",
  "{assigned} jogadores posicionados de dentro para fora. {remaining} continuam sem lugar. As atribuições existentes são mantidas.",
  "Đã xếp {assigned} người chơi từ trong ra ngoài. Còn {remaining} người chưa có vị trí. Các vị trí đã gán được giữ nguyên.",
  "안쪽부터 바깥쪽으로 {assigned}명을 배정했습니다. 미배정 {remaining}명. 기존 배정은 유지됩니다."
 ],
 "Erkannte Namen: {n}": [
  "Names detected: {n}",
  "Noms détectés : {n}",
  "Nombres detectados: {n}",
  "Nomes detectados: {n}",
  "Số tên nhận diện: {n}",
  "인식된 이름: {n}개"
 ],
 "Startaufstellung anwenden?": [
  "Apply starting layout?",
  "Appliquer la disposition initiale ?",
  "¿Aplicar formación inicial?",
  "Aplicar formação inicial?",
  "Áp dụng đội hình ban đầu?",
  "초기 배치를 적용할까요?"
 ],
 "Die Karte wird geleert. Deine Spielerliste und die Kartenkoordinaten bleiben erhalten.": [
  "The map will be cleared. Your player list and map coordinates are preserved.",
  "La carte sera vidée. La liste des joueurs et les coordonnées seront conservées.",
  "Se vaciará el mapa. Se conservarán la lista de jugadores y las coordenadas.",
  "O mapa será limpo. A lista de jogadores e as coordenadas serão mantidas.",
  "Bản đồ sẽ được xóa trống. Danh sách người chơi và tọa độ được giữ nguyên.",
  "지도가 비워집니다. 플레이어 목록과 지도 좌표는 유지됩니다."
 ],
 "Die Positionen werden auf die Vorlage zurückgesetzt. Namen auf den ursprünglichen 100 Plätzen bleiben zugeordnet. Individuell ergänzte Elemente werden entfernt.": [
  "Positions reset to the template. Names on the original 100 seats stay assigned. Individually added elements are removed.",
  "Les positions reviennent au modèle. Les noms sur les 100 places d’origine restent attribués. Les éléments ajoutés sont retirés.",
  "Las posiciones vuelven a la plantilla. Se mantienen los nombres de las 100 plazas originales. Se eliminan los elementos añadidos.",
  "As posições voltam ao modelo. Nomes nos 100 lugares originais continuam atribuídos. Elementos adicionados são removidos.",
  "Vị trí được đặt lại theo mẫu. Tên ở 100 chỗ ban đầu vẫn được giữ. Các đối tượng thêm riêng sẽ bị xóa.",
  "위치가 템플릿으로 초기화됩니다. 원래 100자리의 이름 배정은 유지되고 개별 추가 요소는 제거됩니다."
 ],
 "Plan geöffnet.": [
  "Plan opened.",
  "Plan ouvert.",
  "Plan abierto.",
  "Plano aberto.",
  "Đã mở sơ đồ.",
  "계획을 열었습니다."
 ],
 "Plan öffnen?": [
  "Open plan?",
  "Ouvrir le plan ?",
  "¿Abrir plan?",
  "Abrir plano?",
  "Mở sơ đồ?",
  "계획을 열까요?"
 ],
 "Die geladene Datei ersetzt den aktuellen Plan. Speichere deine Änderungen vorher, wenn du sie behalten möchtest.": [
  "The file replaces the current plan. Save your changes first if you want to keep them.",
  "Le fichier remplace le plan actuel. Enregistre d’abord les modifications à conserver.",
  "El archivo reemplaza el plan actual. Guarda antes los cambios que quieras conservar.",
  "O arquivo substitui o plano atual. Salve antes as alterações que deseja manter.",
  "Tệp sẽ thay thế sơ đồ hiện tại. Hãy lưu trước những thay đổi bạn muốn giữ.",
  "파일이 현재 계획을 대체합니다. 유지하려는 변경 사항을 먼저 저장하세요."
 ],
 "Plan-Datei heruntergeladen. Mit „Öffnen“ kannst du sie später weiterbearbeiten.": [
  "Plan file downloaded. Use “Open” to edit it again later.",
  "Fichier du plan téléchargé. Utilise « Ouvrir » pour le modifier plus tard.",
  "Archivo del plan descargado. Usa «Abrir» para editarlo más tarde.",
  "Arquivo do plano baixado. Use “Abrir” para editar novamente depois.",
  "Đã tải tệp sơ đồ. Dùng “Mở” để chỉnh sửa tiếp sau này.",
  "계획 파일을 다운로드했습니다. 나중에 ‘열기’로 다시 편집하세요."
 ],
 "Koordinatenliste heruntergeladen.": [
  "Coordinate list downloaded.",
  "Liste des coordonnées téléchargée.",
  "Lista de coordenadas descargada.",
  "Lista de coordenadas baixada.",
  "Đã tải danh sách tọa độ.",
  "좌표 목록을 다운로드했습니다."
 ],
 "Plan als SVG heruntergeladen.": [
  "Plan downloaded as SVG.",
  "Plan téléchargé en SVG.",
  "Plan descargado como SVG.",
  "Plano baixado como SVG.",
  "Đã tải sơ đồ dạng SVG.",
  "계획을 SVG로 다운로드했습니다."
 ],
 "PNG-Bild wird vorbereitet …": [
  "Preparing PNG image…",
  "Préparation de l’image PNG…",
  "Preparando imagen PNG…",
  "Preparando imagem PNG…",
  "Đang chuẩn bị ảnh PNG…",
  "PNG 이미지를 준비하는 중…"
 ],
 "Plan als PNG heruntergeladen.": [
  "Plan downloaded as PNG.",
  "Plan téléchargé en PNG.",
  "Plan descargado como PNG.",
  "Plano baixado como PNG.",
  "Đã tải sơ đồ dạng PNG.",
  "계획을 PNG로 다운로드했습니다."
 ],
 "Spieler importieren.": [
  "Import players.",
  "Importer les joueurs.",
  "Importar jugadores.",
  "Importar jogadores.",
  "Nhập người chơi.",
  "플레이어 가져오기."
 ],
 "Namen einfügen oder eine TXT-Datei (ein Name pro Zeile) bzw. CSV (Semikolon) importieren. Nur Namen, keine Kopfzeile. UTF-8 und UTF-16 mit BOM werden unterstützt. Leere und doppelte Einträge werden übersprungen.": [
  "Paste names or import a TXT file (one name per line) or CSV (semicolons). Names only, no header. UTF-8 and UTF-16 with a BOM are supported. Empty and duplicate entries are skipped.",
  "Colle des noms ou importe un TXT (un nom par ligne) ou un CSV (points-virgules). Noms uniquement, sans en-tête. UTF-8 et UTF-16 avec BOM sont acceptés. Les entrées vides et doublons sont ignorés.",
  "Pega nombres o importa TXT (un nombre por línea) o CSV (punto y coma). Solo nombres, sin encabezado. Se admite UTF-8 y UTF-16 con BOM. Se omiten entradas vacías y duplicadas.",
  "Cole nomes ou importe TXT (um nome por linha) ou CSV (ponto e vírgula). Apenas nomes, sem cabeçalho. UTF-8 e UTF-16 com BOM são aceitos. Entradas vazias e duplicadas são ignoradas.",
  "Dán tên hoặc nhập TXT (mỗi dòng một tên) hay CSV (dấu chấm phẩy). Chỉ có tên, không có tiêu đề cột. Hỗ trợ UTF-8 và UTF-16 có BOM. Bỏ qua mục trống và trùng.",
  "이름을 붙여넣거나 TXT(한 줄에 이름 하나), CSV(세미콜론 구분)를 가져오세요. 머리글 없이 이름만 넣으세요. UTF-8과 BOM이 있는 UTF-16을 지원합니다. 빈 항목과 중복은 건너뜁니다."
 ],
 "Koordinaten setzen.": [
  "Set coordinates.",
  "Définir les coordonnées.",
  "Definir coordenadas.",
  "Definir coordenadas.",
  "Đặt tọa độ.",
  "좌표 설정."
 ],
 "Trage X und Y der Mitte des Allianzzentrums ein. Alle Spielerkoordinaten berechnen sich daraus.": [
  "Enter X and Y of the Alliance Center’s midpoint. All player coordinates are calculated from this reference.",
  "Saisis X et Y du milieu du centre d’alliance. Toutes les coordonnées des joueurs en sont déduites.",
  "Introduce X e Y del punto central del centro de alianza. Las coordenadas de los jugadores se calculan desde ahí.",
  "Insira X e Y do ponto central do centro da aliança. Todas as coordenadas dos jogadores são calculadas a partir dessa referência.",
  "Nhập X và Y tại tâm Trung tâm Liên minh. Mọi tọa độ người chơi được tính từ mốc này.",
  "연맹 센터 중심의 X와 Y를 입력하세요. 모든 플레이어 좌표가 이를 기준으로 계산됩니다."
 ],
 "Spieler zuordnen.": [
  "Assign players.",
  "Placer les joueurs.",
  "Asignar jugadores.",
  "Atribuir jogadores.",
  "Xếp chỗ người chơi.",
  "플레이어 배정."
 ],
 "Ziehe einen Namen auf eine Basis. Alternativ: Name anklicken, dann Basis anklicken.": [
  "Drag a name onto a base. Alternatively, click the name, then the base.",
  "Glisse un nom sur une base. Ou clique sur le nom, puis sur la base.",
  "Arrastra un nombre a una base. También puedes pulsar el nombre y luego la base.",
  "Arraste um nome para uma base. Ou clique no nome e depois na base.",
  "Kéo tên vào căn cứ. Hoặc nhấp tên rồi nhấp căn cứ.",
  "이름을 기지로 끌어 놓으세요. 또는 이름을 클릭한 뒤 기지를 클릭하세요."
 ],
 "Autofill nutzen.": [
  "Use autofill.",
  "Utiliser le remplissage auto.",
  "Usar autorrelleno.",
  "Usar preenchimento auto.",
  "Dùng tự động xếp.",
  "자동 배정 사용."
 ],
 "Weise wichtige Spieler zuerst selbst zu. Autofill verteilt die übrigen Namen in Listenreihenfolge auf freie Plätze, vom Allianzzentrum nach außen. Bestehende Zuweisungen bleiben erhalten. Freie Beacon-Plätze werden nur mit Häkchen einbezogen. Strg+Z macht Autofill rückgängig.": [
  "Assign key players manually first. Autofill takes remaining names in list order and fills empty seats from the Alliance Center outwards. Existing assignments stay intact. Empty beacon seats are included only when checked. Ctrl+Z undoes autofill.",
  "Place d’abord les joueurs importants. Le remplissage auto prend les noms restants dans l’ordre de la liste et occupe les places du centre vers l’extérieur. Les attributions existantes restent intactes. Les places de balise libres sont incluses seulement si cochées. Ctrl+Z annule l’opération.",
  "Asigna primero a los jugadores importantes. El autorrelleno toma los nombres restantes en orden de lista y ocupa plazas desde el centro de alianza hacia fuera. Las asignaciones existentes se conservan. Las plazas de baliza libres solo se incluyen al marcar la casilla. Ctrl+Z deshace la operación.",
  "Atribua primeiro os jogadores importantes. O preenchimento auto usa os nomes restantes na ordem da lista e ocupa lugares do centro da aliança para fora. As atribuições existentes são mantidas. Lugares de beacon livres só entram com a opção marcada. Ctrl+Z desfaz a operação.",
  "Hãy tự xếp những người chơi quan trọng trước. Tự động xếp lấy tên còn lại theo thứ tự danh sách và lấp chỗ trống từ Trung tâm Liên minh ra ngoài. Giữ nguyên các vị trí đã gán. Chỗ Beacon trống chỉ được dùng khi tích chọn. Ctrl+Z để hoàn tác.",
  "중요한 플레이어를 먼저 직접 배정하세요. 자동 배정은 남은 이름을 목록 순서대로 연맹 센터에서 가까운 빈 자리부터 채웁니다. 기존 배정은 유지됩니다. 빈 비콘 자리는 옵션을 체크한 경우에만 포함합니다. Ctrl+Z로 취소할 수 있습니다."
 ],
 "Plätze anpassen.": [
  "Adjust seats.",
  "Ajuster les places.",
  "Ajustar plazas.",
  "Ajustar lugares.",
  "Điều chỉnh vị trí.",
  "자리 조정."
 ],
 "Ziehe Basen einzeln oder nutze die Pfeiltasten. Rechts kannst du genaue Kartenkoordinaten eingeben.": [
  "Drag bases individually or use the arrow keys. Enter exact map coordinates on the right.",
  "Déplace les bases une par une ou utilise les flèches. Saisis les coordonnées exactes à droite.",
  "Arrastra bases individualmente o usa las flechas. Introduce coordenadas exactas a la derecha.",
  "Arraste bases individualmente ou use as setas. Insira coordenadas exatas à direita.",
  "Kéo từng căn cứ hoặc dùng phím mũi tên. Nhập tọa độ chính xác ở bên phải.",
  "기지를 개별적으로 끌거나 방향키를 사용하세요. 오른쪽에서 정확한 지도 좌표를 입력할 수 있습니다."
 ],
 "Umgebung ergänzen.": [
  "Add surroundings.",
  "Ajouter les alentours.",
  "Añadir el entorno.",
  "Adicionar o entorno.",
  "Thêm môi trường xung quanh.",
  "주변 요소 추가."
 ],
 "Platziere Marshall, Zentrum, Beacons oder Terrain. Wähle Terrain und ändere Breite und Höhe. Terrainflächen dürfen sich überlappen, Gebäude nicht. Über die Terrain-Auswahl erreichst du auch verdeckte Rechtecke.": [
  "Place the Marshall, center, beacons or terrain. Select terrain and edit its width and height. Terrain areas may overlap each other; buildings cannot overlap. The terrain selector also accesses hidden rectangles.",
  "Place le maréchal, le centre, les balises ou le terrain. Sélectionne le terrain et modifie sa largeur et sa hauteur. Les terrains peuvent se chevaucher, pas les bâtiments. La sélection de terrain permet d’atteindre les rectangles masqués.",
  "Coloca el mariscal, el centro, balizas o terreno. Selecciona terreno y cambia ancho y alto. Los terrenos pueden solaparse entre sí; los edificios no. El selector de terreno permite acceder a rectángulos ocultos.",
  "Posicione marechal, centro, beacons ou terreno. Selecione o terreno e altere largura e altura. Terrenos podem se sobrepor entre si; edifícios não. O seletor de terreno permite acessar retângulos ocultos.",
  "Đặt Nguyên soái, trung tâm, Beacon hoặc địa hình. Chọn địa hình để đổi chiều rộng và chiều cao. Địa hình được chồng lên nhau, công trình thì không. Bộ chọn địa hình giúp chọn cả hình chữ nhật bị che khuất.",
  "마샬, 센터, 비콘 또는 지형을 배치하세요. 지형을 선택해 너비와 높이를 바꾸세요. 지형끼리는 겹칠 수 있지만 건물은 겹칠 수 없습니다. 지형 선택 메뉴에서 가려진 사각형도 선택할 수 있습니다."
 ],
 "Speichern und weitergeben.": [
  "Save and share.",
  "Enregistrer et partager.",
  "Guardar y compartir.",
  "Salvar e compartilhar.",
  "Lưu và chia sẻ.",
  "저장 및 공유."
 ],
 "Speichere die Plan-Datei zum Weiterarbeiten. PNG und SVG enthalten Namen und Koordinaten. CSV liefert die Liste. Beschriftungen werden in der gewählten Sprache exportiert; eigene Namen bleiben erhalten.": [
  "Save the plan file to continue later. PNG and SVG include names and coordinates. CSV provides the list. Labels export in the selected language; custom names are preserved.",
  "Enregistre le plan pour continuer plus tard. PNG et SVG contiennent noms et coordonnées. CSV fournit la liste. Les libellés utilisent la langue choisie ; les noms personnalisés sont conservés.",
  "Guarda el plan para continuar después. PNG y SVG incluyen nombres y coordenadas. CSV contiene la lista. Las etiquetas se exportan en el idioma elegido; se conservan los nombres propios.",
  "Salve o plano para continuar depois. PNG e SVG incluem nomes e coordenadas. CSV fornece a lista. Rótulos são exportados no idioma escolhido; nomes personalizados são preservados.",
  "Lưu tệp sơ đồ để làm tiếp sau. PNG và SVG có tên cùng tọa độ. CSV chứa danh sách. Nhãn được xuất theo ngôn ngữ đã chọn; tên riêng được giữ nguyên.",
  "나중에 이어서 편집하려면 계획 파일을 저장하세요. PNG와 SVG에는 이름과 좌표가 포함되고 CSV에는 목록이 들어갑니다. 표시는 선택한 언어로 내보내며 직접 입력한 이름은 유지됩니다."
 ],
 "Ohne Zentrum bleibt der Koordinatenursprung erhalten. Beim Verschieben des Zentrums werden die Spielerkoordinaten neu berechnet. L4 zeigt geometrisch 25 × 25 Felder je Beacon. Buffs am Rand im Spiel prüfen.": [
  "Without the center, the coordinate origin stays in place. Moving the center recalculates player coordinates. L4 shows a geometric 25 × 25 tiles per beacon. Check buffs at the edges in-game.",
  "Sans centre, l’origine reste en place. Déplacer le centre recalcule les coordonnées des joueurs. L4 représente 25 × 25 cases par balise. Vérifie les bonus aux limites en jeu.",
  "Sin centro, se conserva el origen. Mover el centro recalcula las coordenadas de los jugadores. L4 representa 25 × 25 casillas por baliza. Comprueba los beneficios en los bordes dentro del juego.",
  "Sem o centro, a origem fica mantida. Mover o centro recalcula as coordenadas dos jogadores. L4 representa 25 × 25 casas por beacon. Confira os bônus nas bordas no jogo.",
  "Khi không có trung tâm, gốc tọa độ vẫn giữ nguyên. Di chuyển trung tâm sẽ tính lại tọa độ người chơi. L4 biểu diễn vùng 25 × 25 ô mỗi Beacon. Kiểm tra buff ở rìa trong game.",
  "센터가 없어도 좌표 원점은 유지됩니다. 센터를 옮기면 플레이어 좌표가 다시 계산됩니다. L4는 비콘마다 25 × 25칸의 기하학적 범위를 표시합니다. 경계의 버프는 게임에서 확인하세요."
 ],
 "Tastatur: Pfeile = 1 Feld, Umschalt+Pfeile = 5 Felder, Entf = Entfernen, Strg+Z = Rückgängig, Esc = Abbrechen.": [
  "Keyboard: arrows = 1 tile, Shift+arrows = 5 tiles, Delete = remove, Ctrl+Z = undo, Esc = cancel.",
  "Clavier : flèches = 1 case, Maj+flèches = 5 cases, Suppr = retirer, Ctrl+Z = annuler, Échap = abandonner.",
  "Teclado: flechas = 1 casilla, Mayús+flechas = 5 casillas, Supr = quitar, Ctrl+Z = deshacer, Esc = cancelar.",
  "Teclado: setas = 1 casa, Shift+setas = 5 casas, Delete = remover, Ctrl+Z = desfazer, Esc = cancelar.",
  "Phím: mũi tên = 1 ô, Shift+mũi tên = 5 ô, Delete = xóa, Ctrl+Z = hoàn tác, Esc = hủy.",
  "키보드: 방향키 = 1칸, Shift+방향키 = 5칸, Delete = 제거, Ctrl+Z = 실행 취소, Esc = 취소."
 ],
 "{assigned} / {total} Plätze vergeben · Zentrum X {x} / Y {y}": [
  "{assigned} / {total} seats assigned · Center X {x} / Y {y}",
  "{assigned} / {total} places attribuées · Centre X {x} / Y {y}",
  "{assigned} / {total} plazas asignadas · Centro X {x} / Y {y}",
  "{assigned} / {total} lugares atribuídos · Centro X {x} / Y {y}",
  "Đã xếp {assigned} / {total} vị trí · Trung tâm X {x} / Y {y}",
  "{assigned} / {total}자리 배정 · 센터 X {x} / Y {y}"
 ],
 "Basis 3 × 3 · Zentrum 9 × 9 · Koordinaten der Gebäudemitte · X nach rechts, Y nach oben": [
  "Base 3 × 3 · Center 9 × 9 · Building-center coordinates · X right, Y up",
  "Base 3 × 3 · Centre 9 × 9 · Coordonnées du milieu du bâtiment · X vers la droite, Y vers le haut",
  "Base 3 × 3 · Centro 9 × 9 · Coordenadas del centro del edificio · X derecha, Y arriba",
  "Base 3 × 3 · Centro 9 × 9 · Coordenadas do centro do edifício · X à direita, Y para cima",
  "Căn cứ 3 × 3 · Trung tâm 9 × 9 · Tọa độ tâm công trình · X sang phải, Y lên trên",
  "기지 3 × 3 · 센터 9 × 9 · 건물 중심 좌표 · X 오른쪽, Y 위쪽"
 ],
 "Lichtflächen gemäß eingestellter Breite. L4-Standard: 25 × 25 Kartenfelder.": [
  "Light zones use the configured width. L4 default: 25 × 25 map tiles.",
  "La lumière suit la largeur réglée. L4 par défaut : 25 × 25 cases.",
  "Las zonas de luz usan el ancho configurado. L4 por defecto: 25 × 25 casillas.",
  "As zonas de luz usam a largura configurada. Padrão L4: 25 × 25 casas.",
  "Vùng ánh sáng dùng chiều rộng đã đặt. L4 mặc định: 25 × 25 ô bản đồ.",
  "빛 범위는 설정된 너비를 따릅니다. L4 기본값: 지도 25 × 25칸."
 ],
 "Lichtflächen ausgeblendet.": [
  "Light zones hidden.",
  "Zones de lumière masquées.",
  "Zonas de luz ocultas.",
  "Zonas de luz ocultas.",
  "Đã ẩn vùng ánh sáng.",
  "빛 범위가 숨겨져 있습니다."
 ],
 "Plane deinen Last War Hive mit Drag-and-drop, Spielernamen und automatisch berechneten Kartenkoordinaten.": [
  "Plan your Last War hive with drag and drop, player names and automatic map coordinates.",
  "Planifie ton hive Last War par glisser-déposer, avec noms et coordonnées automatiques.",
  "Planifica tu hive de Last War arrastrando jugadores y calculando coordenadas automáticamente.",
  "Planeje seu hive de Last War com arrastar e soltar, nomes e coordenadas automáticas.",
  "Lập sơ đồ Hive Last War bằng kéo thả, tên người chơi và tọa độ tự động.",
  "드래그 앤 드롭, 플레이어 이름, 자동 지도 좌표로 Last War 하이브를 계획하세요."
 ],
 "Alle Spieler entfernen": [
  "Remove all players",
  "Supprimer tous les joueurs",
  "Eliminar a todos los jugadores",
  "Remover todos os jogadores",
  "Xóa tất cả người chơi",
  "모든 플레이어 제거"
 ],
 "Alle Spieler entfernt. Strg+Z stellt Spieler, Gruppen und Zuweisungen wieder her.": [
  "All players removed. Ctrl+Z restores players, groups and assignments.",
  "Tous les joueurs ont été supprimés. Ctrl+Z restaure les joueurs, les groupes et les affectations.",
  "Todos los jugadores eliminados. Ctrl+Z restaura jugadores, grupos y asignaciones.",
  "Todos os jogadores removidos. Ctrl+Z restaura jogadores, grupos e posições.",
  "Đã xóa tất cả người chơi. Ctrl+Z khôi phục người chơi, nhóm và vị trí đã gán.",
  "모든 플레이어를 제거했습니다. Ctrl+Z로 플레이어, 그룹 및 배치를 복원할 수 있습니다."
 ],
 "Allianzzentrum und Beacons sind nur in Season 4 verfügbar.": [
  "The Alliance Center and beacons are only available in Season 4.",
  "Le centre d’alliance et les balises ne sont disponibles qu’en saison 4.",
  "El centro de alianza y las balizas solo están disponibles en la temporada 4.",
  "O centro da aliança e os sinalizadores só estão disponíveis na temporada 4.",
  "Trung tâm liên minh và beacon chỉ có trong Mùa 4.",
  "연맹 센터와 비콘은 시즌 4에서만 사용할 수 있습니다."
 ],
 "Alle Koordinaten beziehen sich auf {name}. X steigt nach rechts, Y nach oben.": [
  "All coordinates use {name} as the reference. X increases to the right, Y upwards.",
  "Toutes les coordonnées ont pour référence {name}. X augmente vers la droite, Y vers le haut.",
  "Todas las coordenadas toman como referencia {name}. X aumenta a la derecha e Y hacia arriba.",
  "Todas as coordenadas usam {name} como referência. X aumenta para a direita e Y para cima.",
  "Mọi tọa độ lấy {name} làm mốc. X tăng sang phải, Y tăng lên trên.",
  "모든 좌표의 기준은 {name}입니다. X는 오른쪽으로, Y는 위쪽으로 증가합니다."
 ],
 "Gruppe": [
  "Group",
  "Groupe",
  "Grupo",
  "Grupo",
  "Nhóm",
  "그룹"
 ],
 "Gruppen": [
  "Groups",
  "Groupes",
  "Grupos",
  "Grupos",
  "Nhóm",
  "그룹"
 ],
 "Gruppe {n}": [
  "Group {n}",
  "Groupe {n}",
  "Grupo {n}",
  "Grupo {n}",
  "Nhóm {n}",
  "그룹 {n}"
 ],
 "Gruppe auswählen": [
  "Choose a group",
  "Choisir un groupe",
  "Elegir un grupo",
  "Escolher um grupo",
  "Chọn nhóm",
  "그룹 선택"
 ],
 "Keine Gruppe": [
  "No group",
  "Aucun groupe",
  "Sin grupo",
  "Sem grupo",
  "Không có nhóm",
  "그룹 없음"
 ],
 "Aus der Gruppe entfernen": [
  "Remove from group",
  "Retirer du groupe",
  "Quitar del grupo",
  "Remover do grupo",
  "Xóa khỏi nhóm",
  "그룹에서 제외"
 ],
 "{name} aus der Gruppe entfernen": [
  "Remove {name} from group",
  "Retirer {name} du groupe",
  "Quitar a {name} del grupo",
  "Remover {name} do grupo",
  "Xóa {name} khỏi nhóm",
  "그룹에서 {name} 제외"
 ],
 "Spieler aus der Gruppe entfernt.": [
  "Player removed from group.",
  "Joueur retiré du groupe.",
  "Jugador eliminado del grupo.",
  "Jogador removido do grupo.",
  "Đã xóa người chơi khỏi nhóm.",
  "플레이어를 그룹에서 제외했습니다."
 ],
 "Spieler zur Gruppe hinzufügen": [
  "Add player to group",
  "Ajouter un joueur au groupe",
  "Añadir jugador al grupo",
  "Adicionar jogador ao grupo",
  "Thêm người chơi vào nhóm",
  "그룹에 플레이어 추가"
 ],
 "Spieler zur Gruppe hinzugefügt.": [
  "Player added to group.",
  "Joueur ajouté au groupe.",
  "Jugador añadido al grupo.",
  "Jogador adicionado ao grupo.",
  "Đã thêm người chơi vào nhóm.",
  "플레이어를 그룹에 추가했습니다."
 ],
 "Spieler aus der Liste hier hineinziehen.": [
  "Drag players from the list into this box.",
  "Glissez les joueurs de la liste dans cette zone.",
  "Arrastra jugadores de la lista a este recuadro.",
  "Arraste jogadores da lista para esta área.",
  "Kéo người chơi từ danh sách vào ô này.",
  "목록의 플레이어를 이 상자로 끌어오세요."
 ],
 "Spieler auswählen": [
  "Choose a player",
  "Choisir un joueur",
  "Elegir un jugador",
  "Escolher um jogador",
  "Chọn người chơi",
  "플레이어 선택"
 ],
 "Noch keine Gruppenmitglieder.": [
  "No group members yet.",
  "Ce groupe est encore vide.",
  "El grupo aún está vacío.",
  "O grupo ainda está vazio.",
  "Nhóm chưa có thành viên.",
  "아직 그룹원이 없습니다."
 ],
 "{placed} / {total} Gruppenmitglieder platziert.": [
  "{placed} / {total} group members placed.",
  "{placed} / {total} membres du groupe placés.",
  "{placed} / {total} miembros del grupo colocados.",
  "{placed} / {total} membros do grupo posicionados.",
  "Đã xếp vị trí cho {placed} / {total} thành viên nhóm.",
  "그룹원 {placed} / {total}명 배치됨."
 ],
 "Die Gruppe steht noch nicht zusammenhängend.": [
  "The group is not yet connected.",
  "Les membres du groupe ne sont pas encore tous voisins.",
  "El grupo aún no está conectado.",
  "O grupo ainda não está conectado.",
  "Các vị trí trong nhóm chưa liền kề nhau.",
  "그룹원들의 배치가 아직 서로 연결되어 있지 않습니다."
 ],
 "Bitte eine Gruppe von 1 bis 10 wählen.": [
  "Choose a group from 1 to 10.",
  "Choisissez un groupe de 1 à 10.",
  "Elige un grupo del 1 al 10.",
  "Escolha um grupo de 1 a 10.",
  "Chọn một nhóm từ 1 đến 10.",
  "1~10번 중 그룹을 선택하세요."
 ],
 "Ein Spieler darf nur einer Gruppe angehören.": [
  "A player can only belong to one group.",
  "Un joueur ne peut appartenir qu’à un seul groupe.",
  "Un jugador solo puede pertenecer a un grupo.",
  "Um jogador só pode pertencer a um grupo.",
  "Mỗi người chơi chỉ được thuộc một nhóm.",
  "플레이어는 하나의 그룹에만 속할 수 있습니다."
 ],
 "Ungültige Gruppenliste.": [
  "Invalid group list.",
  "Liste de groupes invalide.",
  "Lista de grupos no válida.",
  "Lista de grupos inválida.",
  "Danh sách nhóm không hợp lệ.",
  "그룹 목록이 올바르지 않습니다."
 ],
 "Autofill: Gruppen zusammenhalten, vom Mittelpunkt nach außen.": [
  "Autofill: keep groups together, fill from the center outwards.",
  "Remplissage auto : garder les groupes ensemble, du centre vers l’extérieur.",
  "Autorrelleno: mantener los grupos juntos y llenar del centro hacia fuera.",
  "Preenchimento automático: manter os grupos juntos, do centro para fora.",
  "Tự động xếp: giữ các nhóm gần nhau, xếp từ tâm ra ngoài.",
  "자동 배치: 그룹원을 모아서 중심부터 바깥쪽으로 배치합니다."
 ],
 "Nicht vollständig zusammenhängend: {groups}. Freie Nachbarplätze oder feste Zuweisungen prüfen.": [
  "Not fully connected: {groups}. Check free neighboring seats or fixed assignments.",
  "Groupes non entièrement reliés : {groups}. Vérifiez les places voisines libres ou les affectations fixes.",
  "Sin conexión completa: {groups}. Revisa los sitios vecinos libres o las asignaciones fijas.",
  "Sem conexão completa: {groups}. Confira as posições vizinhas livres ou as atribuições fixas.",
  "Chưa hoàn toàn liền kề: {groups}. Kiểm tra chỗ trống lân cận hoặc vị trí đã gán cố định.",
  "완전히 연결되지 않은 그룹: {groups}. 인접한 빈자리 또는 고정 배치를 확인하세요."
 ],
 "Off Season": [
  "Off Season",
  "Hors saison",
  "Fuera de temporada",
  "Fora de temporada",
  "Ngoài mùa",
  "비시즌"
 ],
 "Season": [
  "Season",
  "Saison",
  "Temporada",
  "Temporada",
  "Mùa",
  "시즌"
 ],
 "Season {n}": [
  "Season {n}",
  "Saison {n}",
  "Temporada {n}",
  "Temporada {n}",
  "Mùa {n}",
  "시즌 {n}"
 ],
 "Season auswählen": [
  "Choose a season",
  "Choisir une saison",
  "Elegir temporada",
  "Escolher temporada",
  "Chọn mùa",
  "시즌 선택"
 ],
 "Season geändert.": [
  "Season changed.",
  "Saison modifiée.",
  "Temporada cambiada.",
  "Temporada alterada.",
  "Đã đổi mùa.",
  "시즌이 변경되었습니다."
 ],
 "Season wechseln?": [
  "Change season?",
  "Changer de saison ?",
  "¿Cambiar de temporada?",
  "Mudar de temporada?",
  "Đổi mùa?",
  "시즌을 변경할까요?"
 ],
 "Ungültige Season.": [
  "Invalid season.",
  "Saison invalide.",
  "Temporada no válida.",
  "Temporada inválida.",
  "Mùa không hợp lệ.",
  "시즌이 올바르지 않습니다."
 ],
 "Noch in Bearbeitung": [
  "Under development",
  "En cours de développement",
  "En desarrollo",
  "Em desenvolvimento",
  "Đang phát triển",
  "개발 중"
 ],
 "Diese Season enthält bisher nur eine neutrale Grundaufstellung.": [
  "This season currently has a basic layout only.",
  "Cette saison ne propose pour l’instant qu’une disposition de base.",
  "Esta temporada solo tiene una distribución básica por ahora.",
  "Esta temporada tem apenas uma disposição básica por enquanto.",
  "Mùa này hiện chỉ có bố cục cơ bản.",
  "이 시즌은 현재 기본 배치만 제공합니다."
 ],
 "Beim Wechsel wird die Aufstellung neu erstellt. Spieler und Gruppen bleiben erhalten.": [
  "Changing season rebuilds the layout. Players and groups are retained.",
  "Changer de saison recrée la disposition. Les joueurs et les groupes sont conservés.",
  "Cambiar de temporada recrea la distribución. Se conservan los jugadores y grupos.",
  "Mudar de temporada recria a disposição. Jogadores e grupos são mantidos.",
  "Đổi mùa sẽ tạo lại bố cục. Người chơi và nhóm được giữ lại.",
  "시즌을 변경하면 배치를 새로 만듭니다. 플레이어와 그룹은 유지됩니다."
 ],
 "Die Season-Vorlage ersetzt die aktuelle Aufstellung und das Terrain. Spieler und Gruppen bleiben erhalten. Strg+Z macht den Wechsel rückgängig.": [
  "The season template replaces the current layout and terrain. Players and groups are retained. Ctrl+Z undoes the change.",
  "Le modèle de saison remplace la disposition et le terrain actuels. Les joueurs et les groupes sont conservés. Ctrl+Z annule le changement.",
  "La plantilla de temporada sustituye la distribución y el terreno actuales. Se conservan jugadores y grupos. Ctrl+Z deshace el cambio.",
  "O modelo da temporada substitui a disposição e o terreno atuais. Jogadores e grupos são mantidos. Ctrl+Z desfaz a alteração.",
  "Mẫu mùa sẽ thay thế bố cục và địa hình hiện tại. Người chơi và nhóm được giữ lại. Ctrl+Z để hoàn tác.",
  "시즌 템플릿이 현재 배치와 지형을 대체합니다. 플레이어와 그룹은 유지됩니다. Ctrl+Z로 되돌릴 수 있습니다."
 ],
 "Der Marshall ist der Bezugspunkt für Koordinaten und Autofill. Ohne Marshall bleibt der markierte Ursprung erhalten.": [
  "The Marshall is the reference for coordinates and autofill. Removing it retains the marked origin.",
  "Le Marshall sert de référence aux coordonnées et au remplissage auto. S’il est retiré, l’origine indiquée est conservée.",
  "El Marshall es la referencia para coordenadas y autorrelleno. Al quitarlo, se conserva el origen marcado.",
  "O Marshall é a referência para coordenadas e preenchimento automático. Ao removê-lo, a origem marcada é mantida.",
  "Marshall là mốc cho tọa độ và tự động xếp. Nếu xóa Marshall, gốc tọa độ đã đánh dấu vẫn được giữ lại.",
  "마샬이 좌표와 자동 배치의 기준입니다. 마샬을 제거해도 표시된 원점은 유지됩니다."
 ],
 "Mittelpunkt und Koordinatenursprung stimmen nicht überein.": [
  "The center and coordinate origin do not match.",
  "Le centre et l’origine des coordonnées ne correspondent pas.",
  "El centro y el origen de coordenadas no coinciden.",
  "O centro e a origem das coordenadas não coincidem.",
  "Tâm và gốc tọa độ không khớp nhau.",
  "중심점과 좌표 원점이 일치하지 않습니다."
 ],
 "Zum Mittelpunkt: X {x} / Y {y}": [
  "From center: X {x} / Y {y}",
  "Depuis le centre : X {x} / Y {y}",
  "Desde el centro: X {x} / Y {y}",
  "Do centro: X {x} / Y {y}",
  "So với tâm: X {x} / Y {y}",
  "중심 기준: X {x} / Y {y}"
 ],
 "Marshall 3 × 3": [
  "Marshall 3 × 3",
  "Marshall 3 × 3",
  "Marshall 3 × 3",
  "Marshall 3 × 3",
  "Marshall 3 × 3",
  "마샬 3 × 3"
 ],
 "Füge Spieler hinzu und verteile sie rund um den Marshall.": [
  "Add players and place them around the Marshall.",
  "Ajoutez des joueurs et placez-les autour du Marshall.",
  "Añade jugadores y colócalos alrededor del Marshall.",
  "Adicione jogadores e posicione-os ao redor do Marshall.",
  "Thêm người chơi và xếp họ quanh Marshall.",
  "플레이어를 추가하고 마샬 주변에 배치하세요."
 ],
 "{assigned} / {total} Plätze vergeben": [
  "{assigned} / {total} seats assigned",
  "{assigned} / {total} places attribuées",
  "{assigned} / {total} sitios asignados",
  "{assigned} / {total} posições atribuídas",
  "Đã gán {assigned} / {total} vị trí",
  "{assigned} / {total}자리 배정됨"
 ],
 "{assigned} / {total} Plätze vergeben · {name} X {x} / Y {y}": [
  "{assigned} / {total} seats assigned · {name} X {x} / Y {y}",
  "{assigned} / {total} places attribuées · {name} X {x} / Y {y}",
  "{assigned} / {total} sitios asignados · {name} X {x} / Y {y}",
  "{assigned} / {total} posições atribuídas · {name} X {x} / Y {y}",
  "Đã gán {assigned} / {total} vị trí · {name} X {x} / Y {y}",
  "{assigned} / {total}자리 배정됨 · {name} X {x} / Y {y}"
 ],
 "Basis 3 × 3 · Marshall 3 × 3 · Koordinaten der Gebäudemitte · X nach rechts, Y nach oben": [
  "Base 3 × 3 · Marshall 3 × 3 · Building-center coordinates · X right, Y up",
  "Base 3 × 3 · Marshall 3 × 3 · Coordonnées du centre du bâtiment · X vers la droite, Y vers le haut",
  "Base 3 × 3 · Marshall 3 × 3 · Coordenadas del centro del edificio · X a la derecha, Y hacia arriba",
  "Base 3 × 3 · Marshall 3 × 3 · Coordenadas do centro do edifício · X para a direita, Y para cima",
  "Căn cứ 3 × 3 · Marshall 3 × 3 · Tọa độ tâm công trình · X sang phải, Y lên trên",
  "기지 3 × 3 · 마샬 3 × 3 · 건물 중심 좌표 · X 오른쪽, Y 위쪽"
 ],
 "Zum Ändern der Größe an den Eckpfeilen auf der Karte ziehen.": [
  "Drag the corner arrows on the map to resize.",
  "Glissez les flèches aux coins sur la carte pour redimensionner.",
  "Arrastra las flechas de las esquinas del mapa para cambiar el tamaño.",
  "Arraste as setas dos cantos no mapa para redimensionar.",
  "Kéo các mũi tên ở góc trên bản đồ để đổi kích thước.",
  "지도에서 모서리 화살표를 끌어 크기를 조절하세요."
 ],
 "Ungültige Terrain-Größe.": [
  "Invalid terrain size.",
  "Taille de terrain invalide.",
  "Tamaño de terreno no válido.",
  "Tamanho de terreno inválido.",
  "Kích thước địa hình không hợp lệ.",
  "지형 크기가 올바르지 않습니다."
 ],
 "Oben links ziehen": [
  "Drag top-left corner",
  "Glisser le coin supérieur gauche",
  "Arrastrar la esquina superior izquierda",
  "Arrastar o canto superior esquerdo",
  "Kéo góc trên bên trái",
  "왼쪽 위 모서리 끌기"
 ],
 "Oben rechts ziehen": [
  "Drag top-right corner",
  "Glisser le coin supérieur droit",
  "Arrastrar la esquina superior derecha",
  "Arrastar o canto superior direito",
  "Kéo góc trên bên phải",
  "오른쪽 위 모서리 끌기"
 ],
 "Unten links ziehen": [
  "Drag bottom-left corner",
  "Glisser le coin inférieur gauche",
  "Arrastrar la esquina inferior izquierda",
  "Arrastar o canto inferior esquerdo",
  "Kéo góc dưới bên trái",
  "왼쪽 아래 모서리 끌기"
 ],
 "Unten rechts ziehen": [
  "Drag bottom-right corner",
  "Glisser le coin inférieur droit",
  "Arrastrar la esquina inferior derecha",
  "Arrastar o canto inferior direito",
  "Kéo góc dưới bên phải",
  "오른쪽 아래 모서리 끌기"
 ],
 "Off Season: Marshall im Mittelpunkt. Season 4: Allianzzentrum und Beacons. Die übrigen Seasons sind als in Bearbeitung markiert.": [
  "Off Season: Marshall at the center. Season 4: Alliance Center and beacons. Other seasons are marked as under development.",
  "Hors saison : Marshall au centre. Saison 4 : centre d’alliance et balises. Les autres saisons sont indiquées comme en développement.",
  "Fuera de temporada: Marshall en el centro. Temporada 4: centro de alianza y balizas. Las demás temporadas están marcadas como en desarrollo.",
  "Fora de temporada: Marshall no centro. Temporada 4: centro da aliança e sinalizadores. As outras temporadas estão marcadas como em desenvolvimento.",
  "Ngoài mùa: Marshall ở tâm. Mùa 4: trung tâm liên minh và beacon. Các mùa khác được đánh dấu đang phát triển.",
  "비시즌: 마샬이 중심입니다. 시즌 4: 연맹 센터와 비콘을 사용합니다. 다른 시즌에는 개발 중 표시가 나타납니다."
 ],
 "Trage die X/Y-Koordinaten des Mittelpunkts ein: Marshall oder Allianzzentrum, passend zur gewählten Season.": [
  "Enter the center’s X/Y coordinates: Marshall or Alliance Center, depending on the selected season.",
  "Saisissez les coordonnées X/Y du centre : Marshall ou centre d’alliance, selon la saison choisie.",
  "Introduce las coordenadas X/Y del centro: Marshall o centro de alianza, según la temporada elegida.",
  "Insira as coordenadas X/Y do centro: Marshall ou centro da aliança, conforme a temporada selecionada.",
  "Nhập tọa độ X/Y của tâm: Marshall hoặc trung tâm liên minh, tùy mùa đã chọn.",
  "선택한 시즌에 따라 마샬 또는 연맹 센터의 X/Y 좌표를 입력하세요."
 ],
 "Wähle unter der Spielerliste Gruppe 1–10. Ziehe Namen in das Gruppenfeld oder nutze die Spielerauswahl. Jeder Spieler gehört höchstens einer Gruppe an. Das × entfernt ihn nur aus der Gruppe.": [
  "Choose Group 1–10 below the player list. Drag names into the group box or use the player picker. Each player belongs to at most one group. The × removes them only from the group.",
  "Choisissez le groupe 1–10 sous la liste des joueurs. Glissez les noms dans la zone du groupe ou utilisez le sélecteur. Chaque joueur appartient à un seul groupe au maximum. Le × le retire uniquement du groupe.",
  "Elige Grupo 1–10 debajo de la lista de jugadores. Arrastra nombres al recuadro del grupo o usa el selector. Cada jugador puede pertenecer a un solo grupo. La × solo lo quita del grupo.",
  "Escolha Grupo 1–10 abaixo da lista de jogadores. Arraste nomes para a área do grupo ou use o seletor. Cada jogador pode pertencer a apenas um grupo. O × remove-o apenas do grupo.",
  "Chọn Nhóm 1–10 bên dưới danh sách người chơi. Kéo tên vào ô nhóm hoặc dùng danh sách chọn. Mỗi người chơi thuộc tối đa một nhóm. Nút × chỉ xóa họ khỏi nhóm.",
  "플레이어 목록 아래에서 그룹 1~10을 선택하세요. 이름을 그룹 상자로 끌거나 플레이어 선택 메뉴를 사용하세요. 각 플레이어는 최대 한 그룹에 속합니다. ×는 그룹에서만 제외합니다."
 ],
 "Autofill setzt Gruppen möglichst kompakt und zusammenhängend, dann einzelne Spieler von innen nach außen. Manuell gesetzte Mitglieder bleiben fest. Bei einem Feld Abstand gelten benachbarte Plätze als zusammenhängend.": [
  "Autofill places groups as compactly and connected as possible, then individual players from the center outwards. Manually placed members stay fixed. With one-tile spacing, neighboring seats count as connected.",
  "Le remplissage auto place les groupes aussi près et reliés que possible, puis les joueurs seuls du centre vers l’extérieur. Les placements manuels restent fixes. Avec un espacement d’une case, les places voisines sont considérées comme reliées.",
  "El autorrelleno coloca grupos lo más compactos y conectados posible y después jugadores individuales del centro hacia fuera. Las posiciones manuales no cambian. Con una casilla de separación, los sitios vecinos cuentan como conectados.",
  "O preenchimento automático coloca os grupos o mais compactos e conectados possível e depois os jogadores individuais do centro para fora. Posições manuais ficam fixas. Com uma casa de intervalo, posições vizinhas contam como conectadas.",
  "Tự động xếp đặt nhóm gần nhau và liền kề nhất có thể, rồi xếp người chơi riêng lẻ từ tâm ra ngoài. Vị trí đã xếp thủ công được giữ nguyên. Khi cách nhau một ô, các vị trí lân cận được tính là liền kề.",
  "자동 배치는 그룹원을 최대한 가깝고 연결되도록 배치한 뒤 개별 플레이어를 중심부터 바깥쪽으로 배치합니다. 수동 배치는 고정됩니다. 한 칸 간격의 배치에서는 이웃한 자리를 연결된 것으로 간주합니다."
 ],
 "Terrain auswählen und an einem der vier Eckpfeile ziehen. Die gegenüberliegende Ecke bleibt fest. Breite und Höhe sind auch rechts eingebbar. Nur Terrainflächen dürfen sich überlappen.": [
  "Select terrain and drag one of its four corner arrows. The opposite corner stays fixed. You can also enter width and height on the right. Only terrain areas may overlap each other.",
  "Sélectionnez un terrain et glissez l’une des quatre flèches aux coins. Le coin opposé reste fixe. La largeur et la hauteur sont aussi modifiables à droite. Seuls les terrains peuvent se chevaucher entre eux.",
  "Selecciona terreno y arrastra una de las cuatro flechas de las esquinas. La esquina opuesta queda fija. También puedes indicar ancho y alto a la derecha. Solo los terrenos pueden solaparse entre sí.",
  "Selecione o terreno e arraste uma das quatro setas dos cantos. O canto oposto fica fixo. Também pode inserir largura e altura à direita. Apenas áreas de terreno podem se sobrepor entre si.",
  "Chọn địa hình rồi kéo một trong bốn mũi tên ở góc. Góc đối diện giữ nguyên. Bạn cũng có thể nhập chiều rộng và cao ở bên phải. Chỉ các vùng địa hình được chồng lên nhau.",
  "지형을 선택하고 네 모서리 화살표 중 하나를 끌어보세요. 반대쪽 모서리는 고정됩니다. 오른쪽에서 너비와 높이를 입력할 수도 있습니다. 지형끼리만 겹칠 수 있습니다."
 ],
 "Der rote Button leert die Spielerliste, Gruppen und Platzzuweisungen. Die Karte bleibt erhalten. Strg+Z stellt alles wieder her.": [
  "The red button clears the player list, groups and assignments. The map stays intact. Ctrl+Z restores everything.",
  "Le bouton rouge vide la liste des joueurs, les groupes et les affectations. La carte est conservée. Ctrl+Z restaure tout.",
  "El botón rojo vacía la lista de jugadores, grupos y asignaciones. El mapa se conserva. Ctrl+Z restaura todo.",
  "O botão vermelho limpa a lista de jogadores, grupos e posições atribuídas. O mapa é mantido. Ctrl+Z restaura tudo.",
  "Nút đỏ xóa danh sách người chơi, nhóm và vị trí đã gán. Bản đồ được giữ nguyên. Ctrl+Z khôi phục tất cả.",
  "빨간 버튼은 플레이어 목록, 그룹 및 자리 배정을 지웁니다. 지도 배치는 유지됩니다. Ctrl+Z로 모두 복원할 수 있습니다."
 ],
 "Plan-Dateien speichern auch Season und Gruppen. PNG/SVG zeigen Namen und Koordinaten, CSV zusätzlich die Gruppenzuordnung.": [
  "Plan files also save the season and groups. PNG/SVG show names and coordinates; CSV also includes group membership.",
  "Les fichiers de plan enregistrent aussi la saison et les groupes. Les PNG/SVG affichent les noms et coordonnées, le CSV indique aussi les groupes.",
  "Los archivos del plan también guardan temporada y grupos. PNG/SVG muestran nombres y coordenadas; el CSV incluye también los grupos.",
  "Os arquivos de plano também salvam temporada e grupos. PNG/SVG mostram nomes e coordenadas; o CSV inclui também os grupos.",
  "Tệp kế hoạch lưu cả mùa và nhóm. PNG/SVG hiển thị tên và tọa độ; CSV có thêm thông tin nhóm.",
  "계획 파일에는 시즌과 그룹도 저장됩니다. PNG/SVG는 이름과 좌표를 표시하고 CSV에는 그룹 정보도 포함됩니다."
 ],
 "Alle Spieler aus dem Hive entfernen": [
  "Remove all players from Hive",
  "Retirer tous les joueurs du Hive",
  "Quitar a todos los jugadores del Hive",
  "Remover todos os jogadores do Hive",
  "Gỡ tất cả người chơi khỏi Hive",
  "Hive에서 모든 플레이어 해제"
 ],
 "Spielerliste und Gruppen bleiben erhalten. Alle Plätze werden frei.": [
  "The player list and groups are retained. All seats become free.",
  "La liste des joueurs et les groupes sont conservés. Toutes les places sont libérées.",
  "Se conservan la lista de jugadores y los grupos. Todos los sitios quedan libres.",
  "A lista de jogadores e os grupos são mantidos. Todas as posições ficam livres.",
  "Danh sách người chơi và các nhóm được giữ lại. Tất cả vị trí sẽ trống.",
  "플레이어 목록과 그룹은 유지됩니다. 모든 자리가 비워집니다."
 ],
 "Alle Plätze freigegeben. Spielerliste und Gruppen bleiben erhalten. Strg+Z macht die Änderung rückgängig.": [
  "All seats cleared. The player list and groups are retained. Ctrl+Z undoes the change.",
  "Toutes les places ont été libérées. La liste des joueurs et les groupes sont conservés. Ctrl+Z annule le changement.",
  "Todos los sitios liberados. Se conservan la lista de jugadores y los grupos. Ctrl+Z deshace el cambio.",
  "Todas as posições foram liberadas. A lista de jogadores e os grupos são mantidos. Ctrl+Z desfaz a alteração.",
  "Đã giải phóng tất cả vị trí. Danh sách người chơi và các nhóm được giữ lại. Ctrl+Z để hoàn tác.",
  "모든 자리를 비웠습니다. 플레이어 목록과 그룹은 유지됩니다. Ctrl+Z로 되돌릴 수 있습니다."
 ],
 "Version {version}": [
  "Version {version}",
  "Version {version}",
  "Versión {version}",
  "Versão {version}",
  "Phiên bản {version}",
  "버전 {version}"
 ],
 "Tastenkürzel: {key}": [
  "Shortcut: {key}",
  "Raccourci : {key}",
  "Atajo: {key}",
  "Atalho: {key}",
  "Phím tắt: {key}",
  "단축키: {key}"
 ],
 "{name} hinzufügen ({key})": [
  "Add {name} ({key})",
  "Ajouter : {name} ({key})",
  "Añadir: {name} ({key})",
  "Adicionar: {name} ({key})",
  "Thêm {name} ({key})",
  "{name} 추가 ({key})"
 ],
 "Hinzufügen: B = Basis, M = Marshall, A = Allianzzentrum, T = Terrain, L = Beacon. Taste drücken, dann auf die Karte klicken. A und L sind nur in Season 4 verfügbar. Beim Schreiben sind diese Kürzel deaktiviert.": [
  "Add: B = base, M = Marshall, A = Alliance Center, T = terrain, L = beacon. Press the key, then click on the map. A and L are available only in Season 4. These shortcuts are disabled while typing.",
  "Ajouter : B = base, M = Marshall, A = centre d’alliance, T = terrain, L = balise. Appuyez sur la touche, puis cliquez sur la carte. A et L sont disponibles uniquement en saison 4. Ces raccourcis sont désactivés pendant la saisie.",
  "Añadir: B = base, M = Marshall, A = centro de alianza, T = terreno, L = baliza. Pulsa la tecla y después haz clic en el mapa. A y L solo están disponibles en la temporada 4. Los atajos se desactivan al escribir.",
  "Adicionar: B = base, M = Marshall, A = centro da aliança, T = terreno, L = sinalizador. Pressione a tecla e clique no mapa. A e L só estão disponíveis na temporada 4. Os atalhos ficam desativados durante a digitação.",
  "Thêm: B = căn cứ, M = Marshall, A = trung tâm liên minh, T = địa hình, L = beacon. Nhấn phím rồi nhấp vào bản đồ. A và L chỉ dùng trong Mùa 4. Các phím tắt này không hoạt động khi đang nhập văn bản.",
  "추가: B = 기지, M = 마샬, A = 연맹 센터, T = 지형, L = 비콘. 키를 누른 다음 지도를 클릭하세요. A와 L은 시즌 4에서만 사용할 수 있습니다. 텍스트 입력 중에는 이 단축키가 작동하지 않습니다."
 ],
 "Zuverlässiger Kern": [
  "Reliable core",
  "Noyau fiable",
  "Núcleo fiable",
  "Núcleo confiável",
  "Nòng cốt đáng tin cậy",
  "믿음직한 핵심 멤버"
 ],
 "Aktiv": [
  "Active",
  "Actif",
  "Activo",
  "Ativo",
  "Năng động",
  "활동적"
 ],
 "Casual": [
  "Casual",
  "Occasionnel",
  "Ocasional",
  "Casual",
  "Chơi thư giãn",
  "라이트 유저"
 ],
 "Priority": [
  "Priority",
  "Priorité",
  "Prioridad",
  "Prioridade",
  "Ưu tiên",
  "우선순위"
 ],
 "Priority & Gruppen": [
  "Priority & groups",
  "Priorité et groupes",
  "Prioridad y grupos",
  "Prioridade e grupos",
  "Ưu tiên & nhóm",
  "우선순위 및 그룹"
 ],
 "Freundesgruppen": [
  "Friend groups",
  "Groupes d’amis",
  "Grupos de amigos",
  "Grupos de amigos",
  "Nhóm bạn bè",
  "친구 그룹"
 ],
 "Spieler organisieren": [
  "Organize players",
  "Organiser les joueurs",
  "Organizar jugadores",
  "Organizar jogadores",
  "Sắp xếp người chơi",
  "플레이어 정리"
 ],
 "Alle sichtbaren auswählen": [
  "Select all visible",
  "Sélectionner tous les joueurs visibles",
  "Seleccionar todos los visibles",
  "Selecionar todos os visíveis",
  "Chọn tất cả đang hiển thị",
  "표시된 플레이어 모두 선택"
 ],
 "Auswahl aufheben": [
  "Clear selection",
  "Effacer la sélection",
  "Quitar selección",
  "Limpar seleção",
  "Bỏ chọn tất cả",
  "선택 해제"
 ],
 "Auswahl zuweisen zu": [
  "Assign selection to",
  "Affecter la sélection à",
  "Asignar selección a",
  "Atribuir seleção a",
  "Gán lựa chọn vào",
  "선택 항목 배정 대상"
 ],
 "Zuweisen": [
  "Assign",
  "Affecter",
  "Asignar",
  "Atribuir",
  "Gán",
  "배정"
 ],
 "Markieren, dann gemeinsam ziehen oder unten zuweisen.": [
  "Select players, then drag them together or assign them below.",
  "Sélectionnez des joueurs, puis faites-les glisser ensemble ou affectez-les ci-dessous.",
  "Selecciona jugadores y arrástralos juntos o asígnalos abajo.",
  "Selecione jogadores e arraste-os juntos ou atribua-os abaixo.",
  "Chọn người chơi, rồi kéo cùng lúc hoặc gán bên dưới.",
  "플레이어를 선택한 뒤 함께 드래그하거나 아래에서 배정하세요."
 ],
 "P1 nach innen, P3 nach außen. Neue Spieler: P2. Eigene Namen ändern die Reihenfolge nicht.": [
  "P1 toward the center, P3 toward the edge. New players: P2. Custom labels do not change the order.",
  "P1 vers le centre, P3 vers le bord. Nouveaux joueurs : P2. Les noms personnalisés ne changent pas cet ordre.",
  "P1 hacia el centro, P3 hacia el borde. Nuevos jugadores: P2. Los nombres personalizados no cambian el orden.",
  "P1 em direção ao centro, P3 às bordas. Novos jogadores: P2. Nomes personalizados não alteram a ordem.",
  "P1 gần tâm, P3 ra ngoài. Người chơi mới: P2. Đổi tên mức ưu tiên không đổi thứ tự.",
  "P1은 안쪽, P3는 바깥쪽에 배치됩니다. 새 플레이어는 P2입니다. 이름을 바꿔도 순서는 유지됩니다."
 ],
 "Der Prioritätsdurchschnitt bestimmt die Reihenfolge der Gruppen. Feste Plätze dienen als Anker. Jede Person gehört höchstens einer Gruppe an.": [
  "Groups are ordered by average priority. Placed members anchor their group. Each player can belong to one group.",
  "La priorité moyenne détermine l’ordre des groupes. Les membres déjà placés servent de points d’ancrage. Chaque joueur appartient à un seul groupe au maximum.",
  "La prioridad media determina el orden de los grupos. Los miembros ya colocados sirven de referencia. Cada jugador puede pertenecer a un solo grupo.",
  "A prioridade média determina a ordem dos grupos. Membros já posicionados servem de referência. Cada jogador pode pertencer a apenas um grupo.",
  "Mức ưu tiên trung bình quyết định thứ tự nhóm. Thành viên đã đặt là điểm neo cho nhóm. Mỗi người chỉ thuộc tối đa một nhóm.",
  "그룹은 평균 우선순위에 따라 배치됩니다. 이미 배치된 멤버를 기준으로 그룹을 배치합니다. 각 플레이어는 최대 한 그룹에 속할 수 있습니다."
 ],
 "Durchschnitt: {value}": [
  "Average: {value}",
  "Moyenne : {value}",
  "Media: {value}",
  "Média: {value}",
  "Trung bình: {value}",
  "평균: {value}"
 ],
 "Bezeichnung bearbeiten": [
  "Edit label",
  "Modifier le nom",
  "Editar nombre",
  "Editar nome",
  "Sửa tên",
  "이름 편집"
 ],
 "Bezeichnung für P{n}": [
  "Label for P{n}",
  "Nom de P{n}",
  "Nombre de P{n}",
  "Nome de P{n}",
  "Tên của P{n}",
  "P{n} 이름"
 ],
 "Prioritätsbezeichnung": [
  "Priority label",
  "Nom de priorité",
  "Nombre de prioridad",
  "Nome da prioridade",
  "Tên mức ưu tiên",
  "우선순위 이름"
 ],
 "Spieler hier hineinziehen": [
  "Drag players here",
  "Glissez les joueurs ici",
  "Arrastra jugadores aquí",
  "Arraste jogadores aqui",
  "Kéo người chơi vào đây",
  "여기에 플레이어를 드래그하세요"
 ],
 "{name} auswählen": [
  "Select {name}",
  "Sélectionner {name}",
  "Seleccionar a {name}",
  "Selecionar {name}",
  "Chọn {name}",
  "{name} 선택"
 ],
 "{n} Spieler ausgewählt": [
  "{n} players selected",
  "{n} joueurs sélectionnés",
  "{n} jugadores seleccionados",
  "{n} jogadores selecionados",
  "Đã chọn {n} người chơi",
  "플레이어 {n}명 선택됨"
 ],
 "{n} Spieler zugewiesen.": [
  "{n} players assigned.",
  "{n} joueurs affectés.",
  "{n} jugadores asignados.",
  "{n} jogadores atribuídos.",
  "Đã gán {n} người chơi.",
  "플레이어 {n}명을 배정했습니다."
 ],
 "Mehrere Spieler bitte einer Priorität oder Gruppe zuordnen.": [
  "Assign multiple players to a priority or a group.",
  "Affectez les joueurs sélectionnés à une priorité ou à un groupe.",
  "Asigna los jugadores seleccionados a una prioridad o a un grupo.",
  "Atribua os jogadores selecionados a uma prioridade ou a um grupo.",
  "Hãy gán nhiều người chơi vào một mức ưu tiên hoặc nhóm.",
  "여러 플레이어는 우선순위 또는 그룹에 배정해 주세요."
 ],
 "Priorität muss 1, 2 oder 3 sein.": [
  "Priority must be 1, 2 or 3.",
  "La priorité doit être 1, 2 ou 3.",
  "La prioridad debe ser 1, 2 o 3.",
  "A prioridade deve ser 1, 2 ou 3.",
  "Mức ưu tiên phải là 1, 2 hoặc 3.",
  "우선순위는 1, 2 또는 3이어야 합니다."
 ],
 "Die Prioritätsbezeichnung darf höchstens 40 Zeichen haben.": [
  "Priority labels must be 40 characters or fewer.",
  "Le nom de priorité ne doit pas dépasser 40 caractères.",
  "El nombre de prioridad debe tener como máximo 40 caracteres.",
  "O nome da prioridade deve ter no máximo 40 caracteres.",
  "Tên mức ưu tiên không được dài quá 40 ký tự.",
  "우선순위 이름은 40자 이하여야 합니다."
 ],
 "Ungültige Prioritätsbezeichnungen.": [
  "Invalid priority labels.",
  "Noms de priorité non valides.",
  "Nombres de prioridad no válidos.",
  "Nomes de prioridade inválidos.",
  "Tên mức ưu tiên không hợp lệ.",
  "우선순위 이름이 올바르지 않습니다."
 ],
 "Autofill: Prioritäten und Gruppendurchschnitt, von innen nach außen.": [
  "Autofill: player priorities and group averages, from the center outward.",
  "Remplissage auto : priorités individuelles et moyennes des groupes, du centre vers l’extérieur.",
  "Autofill: prioridades y medias de grupo, del centro hacia fuera.",
  "Autofill: prioridades e médias dos grupos, do centro para fora.",
  "Tự điền: ưu tiên cá nhân và trung bình nhóm, từ tâm ra ngoài.",
  "자동 배치: 개인 우선순위와 그룹 평균에 따라 안쪽부터 바깥쪽으로 배치합니다."
 ],
 "Öffne „Priority & Gruppen“ unter der Spielerliste. Markiere mehrere Spieler und ziehe sie in P1, P2 oder P3, dann im zweiten Tab in eine der zehn Freundesgruppen. Alternativ nutze „Zuweisen“. Priorität und Gruppe sind unabhängig. Neue Spieler beginnen mit P2. Die Prioritätsnamen sind editierbar.": [
  "Open “Priority & groups” below the roster. Select multiple players and drag them to P1, P2 or P3, then to one of ten friend groups in the second tab. You can also use “Assign”. Priority and group are independent. New players start at P2. Priority labels are editable.",
  "Ouvrez « Priorité et groupes » sous la liste. Sélectionnez plusieurs joueurs et glissez-les dans P1, P2 ou P3, puis dans l’un des dix groupes du second onglet. Vous pouvez aussi utiliser « Affecter ». Priorité et groupe sont indépendants. Les nouveaux joueurs commencent en P2. Les noms des priorités sont modifiables.",
  "Abre «Prioridad y grupos» bajo la lista. Selecciona varios jugadores y arrástralos a P1, P2 o P3 y luego a uno de los diez grupos de amigos en la segunda pestaña. También puedes usar «Asignar». Prioridad y grupo son independientes. Los nuevos jugadores empiezan en P2. Los nombres de prioridad se pueden editar.",
  "Abra “Prioridade e grupos” abaixo da lista. Selecione vários jogadores e arraste-os para P1, P2 ou P3 e depois para um dos dez grupos de amigos na segunda aba. Você também pode usar “Atribuir”. Prioridade e grupo são independentes. Novos jogadores começam em P2. Os nomes das prioridades são editáveis.",
  "Mở “Ưu tiên & nhóm” dưới danh sách. Chọn nhiều người chơi, kéo vào P1, P2 hoặc P3, rồi vào một trong mười nhóm bạn bè ở thẻ thứ hai. Bạn cũng có thể dùng “Gán”. Ưu tiên và nhóm độc lập với nhau. Người chơi mới bắt đầu ở P2. Có thể sửa tên mức ưu tiên.",
  "목록 아래에서 “우선순위 및 그룹”을 여세요. 여러 플레이어를 선택해 P1, P2, P3으로 드래그한 다음 두 번째 탭의 친구 그룹 10개 중 하나로 드래그하세요. “배정” 버튼도 사용할 수 있습니다. 우선순위와 그룹은 서로 독립적입니다. 새 플레이어는 P2로 시작하며 우선순위 이름은 편집할 수 있습니다."
 ],
 "Autofill ordnet einzelne Spieler nach Priorität und Gruppen nach ihrem Prioritätsdurchschnitt von innen nach außen. Gruppen bleiben möglichst zusammen. Manuell gesetzte Mitglieder bleiben fest und dienen als Anker für ihre Gruppe. Bei einem Feld Abstand gelten benachbarte Plätze als zusammenhängend.": [
  "Autofill places individuals by priority and groups by average priority, from the center outward. Groups stay together where possible. Manually placed members stay fixed and anchor their group. In a one-tile-gap layout, neighboring seats across the gap count as connected.",
  "Le remplissage auto place les joueurs selon leur priorité et les groupes selon leur moyenne, du centre vers l’extérieur. Les groupes restent ensemble si possible. Les membres placés manuellement restent fixes et servent d’ancrage. Avec un espacement d’une case, les places voisines sont considérées comme reliées.",
  "Autofill coloca a los jugadores según su prioridad y a los grupos según su media, del centro hacia fuera. Mantiene los grupos juntos cuando es posible. Los miembros colocados manualmente quedan fijos y sirven de referencia. Con un espacio de una casilla, los puestos vecinos se consideran conectados.",
  "Autofill posiciona jogadores pela prioridade e grupos pela média, do centro para fora. Mantém os grupos juntos quando possível. Membros posicionados manualmente ficam fixos e servem de referência. Com um espaço de uma célula, posições vizinhas são consideradas conectadas.",
  "Tự điền xếp cá nhân theo ưu tiên và nhóm theo mức trung bình, từ tâm ra ngoài. Nhóm ở cạnh nhau khi có thể. Thành viên đặt thủ công được giữ nguyên và làm điểm neo cho nhóm. Khi cách nhau một ô, các vị trí liền kề vẫn được tính là kết nối.",
  "자동 배치는 개인의 우선순위와 그룹의 평균 우선순위에 따라 안쪽부터 배치하며, 가능한 한 그룹을 모아 둡니다. 수동 배치된 멤버는 고정되며 그룹 배치의 기준이 됩니다. 한 칸 간격 배치에서는 간격을 사이에 둔 이웃 자리도 연결된 것으로 봅니다."
 ],
 "Plan-Dateien speichern Season, Gruppen, Prioritäten und eigene Prioritätsnamen. PNG/SVG zeigen Namen und Koordinaten, CSV zusätzlich Gruppe und Priorität.": [
  "Plan files save season, groups, priorities and custom priority labels. PNG/SVG show names and coordinates; CSV also includes group and priority.",
  "Les fichiers de plan enregistrent saison, groupes, priorités et noms personnalisés. Les PNG/SVG affichent noms et coordonnées ; le CSV ajoute groupe et priorité.",
  "Los planes guardan temporada, grupos, prioridades y nombres personalizados. PNG/SVG muestran nombres y coordenadas; CSV incluye también grupo y prioridad.",
  "Os planos salvam temporada, grupos, prioridades e nomes personalizados. PNG/SVG mostram nomes e coordenadas; CSV inclui também grupo e prioridade.",
  "Tệp kế hoạch lưu mùa, nhóm, ưu tiên và tên ưu tiên tùy chỉnh. PNG/SVG hiển thị tên và tọa độ; CSV còn có nhóm và ưu tiên.",
  "계획 파일에는 시즌, 그룹, 우선순위와 사용자 지정 우선순위 이름이 저장됩니다. PNG/SVG에는 이름과 좌표가, CSV에는 그룹과 우선순위도 포함됩니다."
 ],
 "Kartenwerkzeuge": [
  "Map tools",
  "Outils de carte",
  "Herramientas del mapa",
  "Ferramentas do mapa",
  "Công cụ bản đồ",
  "지도 도구"
 ],
 "Ansicht verschieben": [
  "Pan view",
  "Déplacer la vue",
  "Mover vista",
  "Mover vista",
  "Di chuyển khung nhìn",
  "화면 이동"
 ],
 "Mehrfachauswahl": [
  "Multi-select",
  "Sélection multiple",
  "Selección múltiple",
  "Seleção múltipla",
  "Chọn nhiều",
  "다중 선택"
 ],
 "Bereich füllen": [
  "Fill area",
  "Remplir une zone",
  "Rellenar área",
  "Preencher área",
  "Lấp đầy vùng",
  "영역 채우기"
 ],
 "Strg + Klick: hinzufügen/entfernen · Umschalt + Ziehen: Auswahlrahmen": [
  "Ctrl + click: add/remove · Shift + drag: selection box",
  "Ctrl + clic : ajouter/retirer · Maj + glisser : cadre de sélection",
  "Ctrl + clic: añadir/quitar · Mayús + arrastrar: marco de selección",
  "Ctrl + clique: adicionar/remover · Shift + arrastar: caixa de seleção",
  "Ctrl + nhấp: thêm/bỏ chọn · Shift + kéo: khung chọn",
  "Ctrl + 클릭: 추가/해제 · Shift + 드래그: 선택 영역"
 ],
 "Abstand zwischen Basen": [
  "Space between bases",
  "Espacement entre les bases",
  "Espacio entre bases",
  "Espaço entre bases",
  "Khoảng cách giữa các căn cứ",
  "기지 사이 간격"
 ],
 "Kein Abstand": [
  "No gap",
  "Sans espace",
  "Sin espacio",
  "Sem espaço",
  "Không có khoảng cách",
  "간격 없음"
 ],
 "1 Feld": [
  "1 tile",
  "1 case",
  "1 casilla",
  "1 célula",
  "1 ô",
  "1칸"
 ],
 "2 Felder": [
  "2 tiles",
  "2 cases",
  "2 casillas",
  "2 células",
  "2 ô",
  "2칸"
 ],
 "Basen erzeugen": [
  "Create bases",
  "Créer les bases",
  "Crear bases",
  "Criar bases",
  "Tạo căn cứ",
  "기지 생성"
 ],
 "Vorschau: Gebäude und Terrain bleiben frei. Die neuen Plätze kannst du anschließend mit Autofill besetzen.": [
  "Preview: buildings and terrain are kept clear. You can assign players to the new seats with Autofill afterwards.",
  "Aperçu : les bâtiments et le terrain sont évités. Vous pourrez ensuite affecter les joueurs aux nouvelles places avec le remplissage auto.",
  "Vista previa: se respetan los edificios y el terreno. Después puedes asignar jugadores a los nuevos puestos con Autofill.",
  "Prévia: edifícios e terreno são evitados. Depois você pode atribuir jogadores às novas posições com Autofill.",
  "Xem trước: không đè lên công trình và địa hình. Sau đó bạn có thể dùng Tự điền để xếp người chơi vào chỗ mới.",
  "미리보기: 건물과 지형을 피해서 배치합니다. 이후 자동 배치로 새 자리에 플레이어를 배정할 수 있습니다."
 ],
 "Ziehe auf der Karte den Bereich auf, der mit Basen gefüllt werden soll.": [
  "Drag out the area on the map to fill with bases.",
  "Tracez sur la carte la zone à remplir de bases.",
  "Dibuja en el mapa el área que quieras llenar de bases.",
  "Arraste no mapa para delimitar a área a preencher com bases.",
  "Kéo trên bản đồ để chọn vùng cần lấp đầy bằng căn cứ.",
  "지도에서 기지로 채울 영역을 드래그하세요."
 ],
 "{n} neue Basen · {blocked} blockierte Plätze": [
  "{n} new bases · {blocked} blocked positions",
  "{n} nouvelles bases · {blocked} positions bloquées",
  "{n} bases nuevas · {blocked} posiciones bloqueadas",
  "{n} novas bases · {blocked} posições bloqueadas",
  "{n} căn cứ mới · {blocked} vị trí bị chặn",
  "새 기지 {n}개 · 막힌 자리 {blocked}개"
 ],
 "{added} Basen hinzugefügt. {skipped} Plätze waren blockiert.": [
  "Added {added} bases. {skipped} positions were blocked.",
  "{added} bases ajoutées. {skipped} positions étaient bloquées.",
  "Se añadieron {added} bases. {skipped} posiciones estaban bloqueadas.",
  "{added} bases adicionadas. {skipped} posições estavam bloqueadas.",
  "Đã thêm {added} căn cứ. Có {skipped} vị trí bị chặn.",
  "기지 {added}개를 추가했습니다. 자리 {skipped}개는 막혀 있었습니다."
 ],
 "Limit: 800 Kartenelemente.": [
  "Limit: 800 map objects.",
  "Limite : 800 objets sur la carte.",
  "Límite: 800 objetos en el mapa.",
  "Limite: 800 objetos no mapa.",
  "Giới hạn: 800 đối tượng trên bản đồ.",
  "제한: 지도 요소 800개."
 ],
 "{n} Elemente": [
  "{n} objects",
  "{n} objets",
  "{n} objetos",
  "{n} objetos",
  "{n} đối tượng",
  "요소 {n}개"
 ],
 "Linke untere Ecke": [
  "Bottom-left corner",
  "Coin inférieur gauche",
  "Esquina inferior izquierda",
  "Canto inferior esquerdo",
  "Góc dưới bên trái",
  "왼쪽 아래 모서리"
 ],
 "Ecke positionieren": [
  "Position corner",
  "Positionner le coin",
  "Posicionar esquina",
  "Posicionar canto",
  "Đặt vị trí góc",
  "모서리 위치 지정"
 ],
 "X und Y setzen die linke untere Ecke der Fläche. Breite und Höhe wachsen von dort nach rechts und oben.": [
  "X and Y set the bottom-left corner. Width and height extend right and upward from there.",
  "X et Y placent le coin inférieur gauche. La largeur et la hauteur s’étendent vers la droite et vers le haut.",
  "X e Y fijan la esquina inferior izquierda. El ancho y el alto se extienden desde ahí hacia la derecha y arriba.",
  "X e Y definem o canto inferior esquerdo. A largura e a altura se estendem para a direita e para cima.",
  "X và Y đặt góc dưới bên trái. Chiều rộng và chiều cao mở rộng từ đó sang phải và lên trên.",
  "X와 Y는 왼쪽 아래 모서리를 지정합니다. 너비와 높이는 그 지점에서 오른쪽과 위쪽으로 늘어납니다."
 ],
 "Je 1–60 Felder. Die linke untere Ecke bleibt bei Größenänderungen fest. Terrain darf anderes Terrain überlappen. Gebäude bleiben frei.": [
  "1–60 tiles each. Resizing keeps the bottom-left corner fixed. Terrain may overlap other terrain. Buildings stay clear.",
  "De 1 à 60 cases par dimension. Le coin inférieur gauche reste fixe lors du redimensionnement. Les terrains peuvent se chevaucher, les bâtiments restent libres.",
  "De 1 a 60 casillas por dimensión. La esquina inferior izquierda queda fija al cambiar el tamaño. El terreno puede superponerse a otro terreno, pero no a edificios.",
  "De 1 a 60 células por dimensão. O canto inferior esquerdo fica fixo ao redimensionar. Terrenos podem se sobrepor, mas edifícios ficam livres.",
  "Mỗi chiều từ 1–60 ô. Góc dưới bên trái được giữ cố định khi đổi kích thước. Địa hình có thể chồng lên địa hình khác, nhưng không đè lên công trình.",
  "각 방향 1–60칸. 크기를 바꿔도 왼쪽 아래 모서리는 고정됩니다. 지형끼리는 겹칠 수 있지만 건물과는 겹칠 수 없습니다."
 ],
 "Terrain platziert. Größe und linke untere Ecke kannst du rechts einstellen.": [
  "Terrain placed. Set its size and bottom-left corner on the right.",
  "Terrain placé. Réglez sa taille et son coin inférieur gauche à droite.",
  "Terreno colocado. Ajusta el tamaño y la esquina inferior izquierda a la derecha.",
  "Terreno posicionado. Ajuste o tamanho e o canto inferior esquerdo à direita.",
  "Đã đặt địa hình. Chỉnh kích thước và góc dưới bên trái ở bảng bên phải.",
  "지형을 배치했습니다. 오른쪽에서 크기와 왼쪽 아래 모서리를 설정하세요."
 ],
 "Terrain-Ecke positioniert.": [
  "Terrain corner positioned.",
  "Coin du terrain positionné.",
  "Esquina del terreno posicionada.",
  "Canto do terreno posicionado.",
  "Đã đặt góc địa hình.",
  "지형 모서리 위치를 지정했습니다."
 ],
 "Verbundene Terrainfläche": [
  "Connected terrain",
  "Terrain connecté",
  "Terreno unido",
  "Terreno conectado",
  "Địa hình đã nối",
  "연결된 지형"
 ],
 "{n} Teile · Außenmaß {w} × {h}": [
  "{n} parts · outer size {w} × {h}",
  "{n} parties · dimensions extérieures {w} × {h}",
  "{n} partes · tamaño exterior {w} × {h}",
  "{n} partes · tamanho externo {w} × {h}",
  "{n} phần · kích thước bao ngoài {w} × {h}",
  "{n}개 조각 · 외곽 크기 {w} × {h}"
 ],
 "Bei verbundenem Terrain bezieht sich die Ecke auf den äußeren Rahmen.": [
  "For connected terrain, the corner refers to its outer bounding rectangle.",
  "Pour un terrain connecté, le coin désigne celui du rectangle qui l’entoure.",
  "En un terreno unido, la esquina corresponde al rectángulo exterior que lo engloba.",
  "No terreno conectado, o canto corresponde ao retângulo externo que o envolve.",
  "Với địa hình đã nối, góc được tính theo hình chữ nhật bao ngoài.",
  "연결된 지형의 모서리는 전체를 감싸는 바깥 사각형을 기준으로 합니다."
 ],
 "Ziehe ein markiertes Element, um die gesamte Auswahl zu verschieben.": [
  "Drag a selected object to move the whole selection.",
  "Glissez un objet sélectionné pour déplacer toute la sélection.",
  "Arrastra un objeto seleccionado para mover toda la selección.",
  "Arraste um objeto selecionado para mover toda a seleção.",
  "Kéo một đối tượng đã chọn để di chuyển toàn bộ lựa chọn.",
  "선택한 요소를 드래그하면 선택된 요소 전체가 이동합니다."
 ],
 "Verschiebung X": [
  "X offset",
  "Décalage X",
  "Desplazamiento X",
  "Deslocamento X",
  "Dịch chuyển X",
  "X 이동량"
 ],
 "Verschiebung Y": [
  "Y offset",
  "Décalage Y",
  "Desplazamiento Y",
  "Deslocamento Y",
  "Dịch chuyển Y",
  "Y 이동량"
 ],
 "Auswahl verschieben": [
  "Move selection",
  "Déplacer la sélection",
  "Mover selección",
  "Mover seleção",
  "Di chuyển lựa chọn",
  "선택 항목 이동"
 ],
 "Auswahl entfernen": [
  "Remove selection",
  "Supprimer la sélection",
  "Eliminar selección",
  "Remover seleção",
  "Xóa lựa chọn",
  "선택 항목 삭제"
 ],
 "Terrain verbinden": [
  "Connect terrain",
  "Connecter les terrains",
  "Unir terrenos",
  "Conectar terrenos",
  "Nối địa hình",
  "지형 연결"
 ],
 "Terrain trennen": [
  "Disconnect terrain",
  "Séparer le terrain",
  "Separar terreno",
  "Separar terreno",
  "Tách địa hình",
  "지형 분리"
 ],
 "Terrainflächen verbunden.": [
  "Terrain areas connected.",
  "Terrains connectés.",
  "Terrenos unidos.",
  "Terrenos conectados.",
  "Đã nối các vùng địa hình.",
  "지형을 연결했습니다."
 ],
 "Terrainverbindung gelöst.": [
  "Terrain parts disconnected.",
  "Parties du terrain séparées.",
  "Partes del terreno separadas.",
  "Partes do terreno separadas.",
  "Đã tách các phần địa hình.",
  "지형 조각을 분리했습니다."
 ],
 "Keine Elemente zum Verschieben ausgewählt.": [
  "No objects selected to move.",
  "Aucun objet sélectionné à déplacer.",
  "No hay objetos seleccionados para mover.",
  "Nenhum objeto selecionado para mover.",
  "Chưa chọn đối tượng để di chuyển.",
  "이동할 요소를 선택하지 않았습니다."
 ],
 "Ein ausgewähltes Element wurde nicht gefunden.": [
  "A selected object was not found.",
  "Un objet sélectionné est introuvable.",
  "No se encontró un objeto seleccionado.",
  "Um objeto selecionado não foi encontrado.",
  "Không tìm thấy một đối tượng đã chọn.",
  "선택한 요소를 찾을 수 없습니다."
 ],
 "Die Verschiebung muss in ganzen Feldern erfolgen.": [
  "Movement must use whole tiles.",
  "Le déplacement doit se faire par cases entières.",
  "El desplazamiento debe ser en casillas enteras.",
  "O deslocamento deve usar células inteiras.",
  "Phải di chuyển theo số ô nguyên.",
  "이동량은 정수 칸 단위여야 합니다."
 ],
 "Die ausgewählten Elemente überschneiden sich nach dem Verschieben.": [
  "The selected objects would overlap after moving.",
  "Les objets sélectionnés se chevaucheraient après le déplacement.",
  "Los objetos seleccionados se superpondrían al moverlos.",
  "Os objetos selecionados ficariam sobrepostos após o deslocamento.",
  "Các đối tượng đã chọn sẽ chồng lên nhau sau khi di chuyển.",
  "이동 후 선택한 요소들이 서로 겹칩니다."
 ],
 "Die ausgewählten Terrainflächen berühren sich nicht durchgehend.": [
  "The selected terrain areas do not form a connected shape.",
  "Les terrains sélectionnés ne forment pas une zone continue.",
  "Los terrenos seleccionados no forman una figura continua.",
  "Os terrenos selecionados não formam uma área contínua.",
  "Các vùng địa hình đã chọn chưa tạo thành một khối liền nhau.",
  "선택한 지형들이 하나로 이어져 있지 않습니다."
 ],
 "Wähle mindestens zwei Terrainflächen aus.": [
  "Select at least two terrain areas.",
  "Sélectionnez au moins deux terrains.",
  "Selecciona al menos dos terrenos.",
  "Selecione pelo menos dois terrenos.",
  "Chọn ít nhất hai vùng địa hình.",
  "지형을 두 개 이상 선택하세요."
 ],
 "Nur Terrainflächen können verbunden werden.": [
  "Only terrain areas can be connected.",
  "Seuls les terrains peuvent être connectés.",
  "Solo se pueden unir terrenos.",
  "Apenas terrenos podem ser conectados.",
  "Chỉ có thể nối các vùng địa hình.",
  "지형만 연결할 수 있습니다."
 ],
 "Nur Terrain kann über seine linke untere Ecke positioniert werden.": [
  "Only terrain can be positioned by its bottom-left corner.",
  "Seul le terrain peut être positionné par son coin inférieur gauche.",
  "Solo el terreno se puede posicionar por su esquina inferior izquierda.",
  "Apenas o terreno pode ser posicionado pelo canto inferior esquerdo.",
  "Chỉ địa hình mới có thể đặt theo góc dưới bên trái.",
  "왼쪽 아래 모서리로 위치를 지정할 수 있는 것은 지형뿐입니다."
 ],
 "Terrain-Koordinaten müssen in Schritten von 0,5 zwischen 0 und 999999 liegen.": [
  "Terrain coordinates must be in steps of 0.5 between 0 and 999999.",
  "Les coordonnées du terrain doivent être comprises entre 0 et 999999, par pas de 0,5.",
  "Las coordenadas del terreno deben estar entre 0 y 999999, en incrementos de 0,5.",
  "As coordenadas do terreno devem estar entre 0 e 999999, em passos de 0,5.",
  "Tọa độ địa hình phải từ 0 đến 999999, theo bước 0,5.",
  "지형 좌표는 0에서 999999 사이의 0.5 단위여야 합니다."
 ],
 "Löse die Terrainverbindung, um einzelne Teile zu vergrößern.": [
  "Disconnect the terrain to resize individual parts.",
  "Séparez le terrain pour redimensionner ses différentes parties.",
  "Separa el terreno para cambiar el tamaño de sus partes.",
  "Separe o terreno para redimensionar partes individuais.",
  "Tách địa hình để đổi kích thước từng phần.",
  "개별 조각의 크기를 바꾸려면 지형을 분리하세요."
 ],
 "Verbundene Terrainflächen müssen gemeinsam verschoben werden.": [
  "Connected terrain parts must move together.",
  "Les parties connectées du terrain doivent être déplacées ensemble.",
  "Las partes unidas del terreno deben moverse juntas.",
  "As partes conectadas do terreno devem ser movidas juntas.",
  "Các phần địa hình đã nối phải được di chuyển cùng nhau.",
  "연결된 지형 조각은 함께 이동해야 합니다."
 ],
 "Ungültige Objektposition.": [
  "Invalid object position.",
  "Position d’objet non valide.",
  "Posición de objeto no válida.",
  "Posição de objeto inválida.",
  "Vị trí đối tượng không hợp lệ.",
  "요소 위치가 올바르지 않습니다."
 ],
 "Ungültige Terrain-Gruppe.": [
  "Invalid terrain group.",
  "Groupe de terrains non valide.",
  "Grupo de terrenos no válido.",
  "Grupo de terrenos inválido.",
  "Nhóm địa hình không hợp lệ.",
  "지형 그룹이 올바르지 않습니다."
 ],
 "Ungültiger Füllbereich oder Basisabstand.": [
  "Invalid fill area or base spacing.",
  "Zone de remplissage ou espacement des bases non valide.",
  "Área de relleno o espacio entre bases no válido.",
  "Área de preenchimento ou espaçamento entre bases inválido.",
  "Vùng lấp đầy hoặc khoảng cách căn cứ không hợp lệ.",
  "채우기 영역 또는 기지 간격이 올바르지 않습니다."
 ],
 "Terrain auswählen: Rechts lassen sich Größe und X/Y der linken unteren Ecke einstellen. Größenänderungen im Menü halten diese Ecke fest; Eckpfeile halten die gegenüberliegende Ecke fest. Benachbarte oder überlappende Terrainstücke gemeinsam markieren und mit „Terrain verbinden“ zu einer Form zusammenfügen. „Terrain trennen“ gibt die Teile wieder einzeln frei.": [
  "Select terrain to set its size and bottom-left X/Y on the right. Resizing in the panel keeps this corner fixed; corner handles keep the opposite corner fixed. Select touching or overlapping parts and use “Connect terrain” to form one shape. “Disconnect terrain” makes the parts editable separately again.",
  "Sélectionnez un terrain pour régler sa taille et les coordonnées X/Y de son coin inférieur gauche à droite. Le menu garde ce coin fixe ; les poignées gardent le coin opposé fixe. Sélectionnez des parties adjacentes ou superposées et utilisez « Connecter les terrains » pour former un seul objet. « Séparer le terrain » rend les parties à nouveau indépendantes.",
  "Selecciona un terreno para ajustar su tamaño y las coordenadas X/Y de la esquina inferior izquierda a la derecha. El menú mantiene fija esa esquina; los tiradores mantienen fija la opuesta. Selecciona partes contiguas o superpuestas y usa «Unir terrenos» para formar una sola figura. «Separar terreno» permite editarlas por separado.",
  "Selecione um terreno para ajustar o tamanho e as coordenadas X/Y do canto inferior esquerdo à direita. O menu mantém esse canto fixo; as alças mantêm o canto oposto fixo. Selecione partes adjacentes ou sobrepostas e use “Conectar terrenos” para formar um único objeto. “Separar terreno” permite editar as partes individualmente.",
  "Chọn địa hình để chỉnh kích thước và X/Y của góc dưới bên trái ở bảng bên phải. Đổi kích thước trong menu giữ cố định góc này; kéo tay nắm giữ cố định góc đối diện. Chọn các phần liền nhau hoặc chồng lên nhau và dùng “Nối địa hình” để tạo một khối. “Tách địa hình” cho phép sửa từng phần riêng.",
  "지형을 선택하면 오른쪽에서 크기와 왼쪽 아래 모서리의 X/Y를 설정할 수 있습니다. 메뉴에서 크기를 바꾸면 이 모서리가 고정되고, 모서리 손잡이를 끌면 반대쪽 모서리가 고정됩니다. 닿거나 겹치는 조각을 함께 선택하고 “지형 연결”로 하나의 모양을 만드세요. “지형 분리”로 각 조각을 다시 편집할 수 있습니다."
 ],
 "Mit Strg + Klick Elemente hinzufügen oder entfernen. Mit Umschalt + Ziehen oder dem Werkzeug Mehrfachauswahl einen Rahmen aufziehen. Nur vollständig enthaltene Elemente werden gewählt; verbundenes Terrain wird als Ganzes gewählt. Danach ein markiertes Element ziehen oder die Pfeiltasten nutzen.": [
  "Ctrl + click adds or removes objects. Shift + drag or the Multi-select tool draws a selection box. Only fully enclosed objects are selected; connected terrain is selected as a whole. Then drag a selected object or use the arrow keys.",
  "Ctrl + clic ajoute ou retire des objets. Maj + glisser ou l’outil Sélection multiple trace un cadre. Seuls les objets entièrement inclus sont sélectionnés ; les terrains connectés sont sélectionnés en entier. Glissez ensuite un objet sélectionné ou utilisez les flèches.",
  "Ctrl + clic añade o quita objetos. Mayús + arrastrar o la herramienta Selección múltiple dibuja un marco. Solo se seleccionan los objetos completamente incluidos; el terreno unido se selecciona entero. Luego arrastra un objeto seleccionado o usa las flechas.",
  "Ctrl + clique adiciona ou remove objetos. Shift + arrastar ou a ferramenta Seleção múltipla cria uma caixa. Apenas objetos totalmente incluídos são selecionados; terrenos conectados são selecionados por inteiro. Depois arraste um objeto selecionado ou use as setas.",
  "Ctrl + nhấp để thêm hoặc bỏ đối tượng. Shift + kéo hoặc công cụ Chọn nhiều để vẽ khung chọn. Chỉ chọn đối tượng nằm hoàn toàn trong khung; địa hình đã nối được chọn cả khối. Sau đó kéo đối tượng đã chọn hoặc dùng phím mũi tên.",
  "Ctrl + 클릭으로 요소를 추가하거나 해제합니다. Shift + 드래그 또는 다중 선택 도구로 선택 영역을 그리세요. 영역에 완전히 포함된 요소만 선택되며 연결된 지형은 전체가 선택됩니다. 이후 선택한 요소를 드래그하거나 방향키를 사용하세요."
 ],
 "Bereich füllen wählen, ein Rechteck aufziehen und 0, 1 oder 2 Felder Abstand einstellen. Die Vorschau zeigt passende freie Basisplätze. Mit Basen erzeugen übernehmen; danach kann Autofill die Spieler verteilen. Strg + Z nimmt den gesamten Schritt zurück.": [
  "Choose Fill area, draw a rectangle and set a gap of 0, 1 or 2 tiles. The preview shows available base positions. Apply with Create bases; Autofill can then assign players. Ctrl + Z undoes the entire step.",
  "Choisissez Remplir une zone, tracez un rectangle et réglez l’espacement sur 0, 1 ou 2 cases. L’aperçu montre les positions libres. Validez avec Créer les bases ; le remplissage auto pourra ensuite répartir les joueurs. Ctrl + Z annule toute l’étape.",
  "Elige Rellenar área, dibuja un rectángulo y ajusta el espacio a 0, 1 o 2 casillas. La vista previa muestra los puestos libres. Confirma con Crear bases; después Autofill puede asignar jugadores. Ctrl + Z deshace todo el paso.",
  "Escolha Preencher área, desenhe um retângulo e defina 0, 1 ou 2 células de espaço. A prévia mostra as posições livres. Confirme com Criar bases; depois Autofill pode atribuir os jogadores. Ctrl + Z desfaz toda a etapa.",
  "Chọn Lấp đầy vùng, vẽ hình chữ nhật và đặt khoảng cách 0, 1 hoặc 2 ô. Xem trước hiển thị các vị trí căn cứ còn trống. Nhấn Tạo căn cứ để áp dụng; sau đó dùng Tự điền để xếp người chơi. Ctrl + Z hoàn tác toàn bộ bước này.",
  "영역 채우기를 선택하고 사각형을 그린 뒤 간격을 0, 1, 2칸 중 선택하세요. 미리보기에 가능한 빈 기지 자리가 표시됩니다. 기지 생성으로 적용한 뒤 자동 배치로 플레이어를 배정할 수 있습니다. Ctrl + Z로 전체 작업을 되돌릴 수 있습니다."
 ],
 "1000 × 1000 Felder · X/Y 0–999": [
  "1000 × 1000 tiles · X/Y 0–999",
  "1000 × 1000 cases · X/Y 0–999",
  "1000 × 1000 casillas · X/Y 0–999",
  "1000 × 1000 células · X/Y 0–999",
  "1000 × 1000 ô · X/Y 0–999",
  "1000 × 1000칸 · X/Y 0–999"
 ],
 "Weltkarte": [
  "World map",
  "Carte du monde",
  "Mapa del mundo",
  "Mapa do mundo",
  "Bản đồ thế giới",
  "세계 지도"
 ],
 "Kartenkoordinaten des linken unteren Feldes": [
  "Map coordinates of the bottom-left tile",
  "Coordonnées de la case en bas à gauche",
  "Coordenadas de la casilla inferior izquierda",
  "Coordenadas da célula inferior esquerda",
  "Tọa độ ô dưới cùng bên trái",
  "왼쪽 아래 칸의 지도 좌표"
 ],
 "Gesamten Hive ausrichten": [
  "Align entire Hive",
  "Repositionner tout le Hive",
  "Reubicar todo el Hive",
  "Reposicionar todo o Hive",
  "Định vị toàn bộ Hive",
  "Hive 전체 위치 설정"
 ],
 "Ganzzahlige X/Y-Koordinaten des linken unteren Feldes. Das gesamte Objekt bleibt innerhalb von 0–999.": [
  "Whole-number X/Y coordinates of the bottom-left tile. The entire object must stay within 0–999.",
  "Coordonnées X/Y entières de la case en bas à gauche. Tout l’objet doit rester entre 0 et 999.",
  "Coordenadas X/Y enteras de la casilla inferior izquierda. Todo el objeto debe quedar entre 0 y 999.",
  "Coordenadas X/Y inteiras da célula inferior esquerda. O objeto inteiro deve ficar entre 0 e 999.",
  "Tọa độ X/Y nguyên của ô dưới cùng bên trái. Toàn bộ đối tượng phải nằm trong phạm vi 0–999.",
  "왼쪽 아래 칸의 X/Y 정수 좌표입니다. 물체 전체가 0–999 범위 안에 있어야 합니다."
 ],
 "Bei verbundenem Terrain beziehen sich die Koordinaten auf das linke untere Feld des äußeren Rahmens.": [
  "For connected terrain, coordinates refer to the bottom-left tile of its outer bounding rectangle.",
  "Pour un terrain connecté, les coordonnées désignent la case en bas à gauche du rectangle qui l’englobe.",
  "En terrenos unidos, las coordenadas indican la casilla inferior izquierda del rectángulo exterior.",
  "Em terrenos conectados, as coordenadas indicam a célula inferior esquerda do retângulo externo.",
  "Với địa hình đã nối, tọa độ chỉ ô dưới cùng bên trái của khung chữ nhật bao ngoài.",
  "연결된 지형은 전체를 둘러싼 사각형의 왼쪽 아래 칸을 좌표로 사용합니다."
 ],
 "Verschiebt den gesamten Plan anhand von {name}. Einzelne Objekte verschiebst du über ihre Auswahl.": [
  "Moves the entire plan using {name} as the reference. Select an object to move it individually.",
  "Déplace tout le plan en prenant {name} comme référence. Sélectionnez un objet pour le déplacer seul.",
  "Mueve todo el plano tomando {name} como referencia. Selecciona un objeto para moverlo individualmente.",
  "Move todo o plano usando {name} como referência. Selecione um objeto para movê-lo individualmente.",
  "Di chuyển toàn bộ bản thiết kế theo {name}. Chọn một đối tượng để di chuyển riêng.",
  "{name}을 기준으로 전체 배치를 옮깁니다. 개별 물체를 옮기려면 해당 물체를 선택하세요."
 ],
 "Alle Koordinaten bezeichnen das linke untere Feld. Verschieben verändert nur die gewählten Objekte. L4 zeigt 25 × 25 Felder je Beacon.": [
  "All coordinates refer to the bottom-left tile. Moving objects changes only the selection. L4 covers 25 × 25 tiles per beacon.",
  "Toutes les coordonnées désignent la case en bas à gauche. Le déplacement ne concerne que les objets sélectionnés. L4 couvre 25 × 25 cases par balise.",
  "Todas las coordenadas indican la casilla inferior izquierda. Solo se mueven los objetos seleccionados. L4 cubre 25 × 25 casillas por baliza.",
  "Todas as coordenadas indicam a célula inferior esquerda. Apenas os objetos selecionados se movem. L4 cobre 25 × 25 células por sinalizador.",
  "Mọi tọa độ đều chỉ ô dưới cùng bên trái. Chỉ các đối tượng được chọn mới di chuyển. L4 phủ 25 × 25 ô cho mỗi đèn hiệu.",
  "모든 좌표는 왼쪽 아래 칸을 나타냅니다. 선택한 물체만 이동합니다. L4는 비컨마다 25 × 25칸을 표시합니다."
 ],
 "Alle Koordinaten bezeichnen das linke untere Feld. Der Marshall bleibt der Bezugspunkt für Autofill.": [
  "All coordinates refer to the bottom-left tile. The Marshall remains the reference for Autofill.",
  "Toutes les coordonnées désignent la case en bas à gauche. Le Marshall reste la référence du remplissage automatique.",
  "Todas las coordenadas indican la casilla inferior izquierda. El Marshall sigue siendo la referencia de Autofill.",
  "Todas as coordenadas indicam a célula inferior esquerda. O Marshall continua sendo a referência do Autofill.",
  "Mọi tọa độ đều chỉ ô dưới cùng bên trái. Marshall vẫn là tâm tham chiếu cho Tự điền.",
  "모든 좌표는 왼쪽 아래 칸을 나타냅니다. 자동 배치는 계속 Marshall을 기준으로 합니다."
 ],
 "X und Y müssen ganze Zahlen von 0 bis 999 sein.": [
  "X and Y must be whole numbers from 0 to 999.",
  "X et Y doivent être des nombres entiers de 0 à 999.",
  "X e Y deben ser números enteros de 0 a 999.",
  "X e Y devem ser números inteiros de 0 a 999.",
  "X và Y phải là số nguyên từ 0 đến 999.",
  "X와 Y는 0부터 999까지의 정수여야 합니다."
 ],
 "Objekte müssen auf ganzen Kartenfeldern stehen.": [
  "Objects must align with whole map tiles.",
  "Les objets doivent être alignés sur des cases entières.",
  "Los objetos deben alinearse con casillas enteras.",
  "Os objetos devem se alinhar a células inteiras.",
  "Đối tượng phải khớp với các ô nguyên trên bản đồ.",
  "물체는 지도 칸에 정확히 맞춰야 합니다."
 ],
 "Das gesamte Objekt muss innerhalb der Karte liegen (X/Y 0–999).": [
  "The entire object must fit inside the map (X/Y 0–999).",
  "L’objet entier doit tenir dans la carte (X/Y 0–999).",
  "Todo el objeto debe quedar dentro del mapa (X/Y 0–999).",
  "O objeto inteiro deve ficar dentro do mapa (X/Y 0–999).",
  "Toàn bộ đối tượng phải nằm trong bản đồ (X/Y 0–999).",
  "물체 전체가 지도 안에 있어야 합니다(X/Y 0–999)."
 ],
 "Der ältere Plan liegt außerhalb der neuen Karte (X/Y 0–999) und wurde nicht geladen.": [
  "The older plan extends beyond the new map (X/Y 0–999) and was not loaded.",
  "L’ancien plan dépasse la nouvelle carte (X/Y 0–999) et n’a pas été chargé.",
  "El plano antiguo supera los límites del nuevo mapa (X/Y 0–999) y no se ha cargado.",
  "O plano antigo ultrapassa o novo mapa (X/Y 0–999) e não foi carregado.",
  "Bản thiết kế cũ nằm ngoài bản đồ mới (X/Y 0–999) nên chưa được tải.",
  "이전 배치가 새 지도 범위(X/Y 0–999)를 벗어나 불러오지 않았습니다."
 ],
 "Älterer Plan auf ganze Felder umgestellt. Koordinaten beziehen sich jetzt auf das linke untere Feld.": [
  "Older plan aligned to whole tiles. Coordinates now refer to the bottom-left tile.",
  "Ancien plan aligné sur des cases entières. Les coordonnées désignent maintenant la case en bas à gauche.",
  "Plano antiguo ajustado a casillas enteras. Las coordenadas ahora indican la casilla inferior izquierda.",
  "Plano antigo alinhado a células inteiras. As coordenadas agora indicam a célula inferior esquerda.",
  "Bản thiết kế cũ đã được căn theo ô nguyên. Tọa độ giờ chỉ ô dưới cùng bên trái.",
  "이전 배치를 정수 칸에 맞췄습니다. 좌표는 이제 왼쪽 아래 칸을 나타냅니다."
 ],
 "Wähle ein Objekt und gib rechts die X/Y-Koordinaten seines linken unteren Feldes ein. Mit „Gesamten Hive ausrichten“ verschiebst du alle Positionen gemeinsam. Die Welt umfasst 1000 × 1000 Felder (0–999).": [
  "Select an object and enter the X/Y coordinates of its bottom-left tile on the right. Align entire Hive moves all positions together. The world has 1000 × 1000 tiles (0–999).",
  "Sélectionnez un objet et saisissez à droite les coordonnées X/Y de sa case en bas à gauche. Repositionner tout le Hive déplace toutes les positions ensemble. Le monde comporte 1000 × 1000 cases (0–999).",
  "Selecciona un objeto e introduce a la derecha las coordenadas X/Y de su casilla inferior izquierda. Reubicar todo el Hive mueve todas las posiciones a la vez. El mundo tiene 1000 × 1000 casillas (0–999).",
  "Selecione um objeto e insira à direita as coordenadas X/Y da célula inferior esquerda. Reposicionar todo o Hive move todas as posições juntas. O mundo tem 1000 × 1000 células (0–999).",
  "Chọn đối tượng rồi nhập tọa độ X/Y của ô dưới cùng bên trái ở bảng bên phải. Định vị toàn bộ Hive di chuyển mọi vị trí cùng nhau. Thế giới có 1000 × 1000 ô (0–999).",
  "물체를 선택하고 오른쪽에서 왼쪽 아래 칸의 X/Y 좌표를 입력하세요. Hive 전체 위치 설정은 모든 위치를 함께 옮깁니다. 세계 지도는 1000 × 1000칸입니다(0–999)."
 ],
 "Basis 3 × 3 · Zentrum 9 × 9 · Koordinaten: linkes unteres Feld · Welt 1000 × 1000": [
  "Base 3 × 3 · Center 9 × 9 · Coordinates: bottom-left tile · World 1000 × 1000",
  "Base 3 × 3 · Centre 9 × 9 · Coordonnées : case en bas à gauche · Monde 1000 × 1000",
  "Base 3 × 3 · Centro 9 × 9 · Coordenadas: casilla inferior izquierda · Mundo 1000 × 1000",
  "Base 3 × 3 · Centro 9 × 9 · Coordenadas: célula inferior esquerda · Mundo 1000 × 1000",
  "Căn cứ 3 × 3 · Trung tâm 9 × 9 · Tọa độ: ô dưới cùng bên trái · Thế giới 1000 × 1000",
  "기지 3 × 3 · 센터 9 × 9 · 좌표: 왼쪽 아래 칸 · 세계 1000 × 1000"
 ],
 "Basis 3 × 3 · Marshall 3 × 3 · Koordinaten: linkes unteres Feld · Welt 1000 × 1000": [
  "Base 3 × 3 · Marshall 3 × 3 · Coordinates: bottom-left tile · World 1000 × 1000",
  "Base 3 × 3 · Marshall 3 × 3 · Coordonnées : case en bas à gauche · Monde 1000 × 1000",
  "Base 3 × 3 · Marshall 3 × 3 · Coordenadas: casilla inferior izquierda · Mundo 1000 × 1000",
  "Base 3 × 3 · Marshall 3 × 3 · Coordenadas: célula inferior esquerda · Mundo 1000 × 1000",
  "Căn cứ 3 × 3 · Marshall 3 × 3 · Tọa độ: ô dưới cùng bên trái · Thế giới 1000 × 1000",
  "기지 3 × 3 · Marshall 3 × 3 · 좌표: 왼쪽 아래 칸 · 세계 1000 × 1000"
 ],
 "Layout-Varianten": [
  "Layout variants",
  "Variantes de disposition",
  "Variantes de distribución",
  "Variantes de disposição",
  "Các biến thể bố cục",
  "배치 변형"
 ],
 "Layout-Variante": [
  "Layout variant",
  "Variante de disposition",
  "Variante de distribución",
  "Variante de disposição",
  "Biến thể bố cục",
  "배치 변형"
 ],
 "Aktuelle Variante zurücksetzen": [
  "Reset current variant",
  "Réinitialiser cette variante",
  "Restablecer variante actual",
  "Redefinir variante atual",
  "Đặt lại biến thể hiện tại",
  "현재 변형 초기화"
 ],
 "Aktuelle Variante zurücksetzen?": [
  "Reset the current variant?",
  "Réinitialiser cette variante ?",
  "¿Restablecer la variante actual?",
  "Redefinir a variante atual?",
  "Đặt lại biến thể hiện tại?",
  "현재 변형을 초기화할까요?"
 ],
 "Nur die geöffnete Variante wird auf ihre Startaufstellung zurückgesetzt. Alle anderen Varianten und die Spielerliste bleiben erhalten. Strg+Z macht dies rückgängig.": [
  "Only the open variant returns to its starting layout. All other variants and the roster are kept. Ctrl+Z undoes this.",
  "Seule la variante ouverte revient à sa disposition initiale. Les autres variantes et la liste des joueurs sont conservées. Ctrl+Z annule cette action.",
  "Solo la variante abierta vuelve a su distribución inicial. Las demás variantes y la lista de jugadores se conservan. Ctrl+Z deshace esta acción.",
  "Somente a variante aberta volta à disposição inicial. As outras variantes e a lista de jogadores são mantidas. Ctrl+Z desfaz esta ação.",
  "Chỉ biến thể đang mở được đặt lại về bố cục ban đầu. Các biến thể khác và danh sách người chơi được giữ nguyên. Ctrl+Z để hoàn tác.",
  "열린 변형만 초기 배치로 돌아갑니다. 다른 변형과 플레이어 목록은 유지됩니다. Ctrl+Z로 되돌릴 수 있습니다."
 ],
 "Jede Season und jedes Layout behält seinen eigenen Kartenstand. Spieler, Gruppen und Prioritäten gelten für alle Varianten.": [
  "Each season and layout keeps its own map. Players, groups and priorities are shared across all variants.",
  "Chaque saison et disposition conserve sa propre carte. Les joueurs, groupes et priorités sont communs à toutes les variantes.",
  "Cada temporada y distribución conserva su propio mapa. Los jugadores, grupos y prioridades se comparten entre todas las variantes.",
  "Cada temporada e disposição mantém seu próprio mapa. Jogadores, grupos e prioridades são compartilhados entre todas as variantes.",
  "Mỗi mùa và bố cục giữ bản đồ riêng. Người chơi, nhóm và mức ưu tiên được dùng chung cho mọi biến thể.",
  "각 시즌과 배치는 별도의 지도를 유지합니다. 플레이어, 그룹, 우선순위는 모든 변형에서 공유됩니다."
 ],
 "Wechseln bewahrt deine Arbeit. Plan speichern sichert alle Varianten gemeinsam.": [
  "Switching keeps your work. Save plan saves all variants together.",
  "Changer de variante conserve votre travail. Enregistrer le plan sauvegarde toutes les variantes ensemble.",
  "Cambiar de variante conserva tu trabajo. Guardar plano guarda todas las variantes juntas.",
  "Trocar de variante preserva seu trabalho. Salvar plano salva todas as variantes juntas.",
  "Chuyển đổi vẫn giữ nguyên công việc. Lưu bản thiết kế sẽ lưu tất cả biến thể cùng nhau.",
  "전환해도 작업이 유지됩니다. 배치 저장은 모든 변형을 함께 저장합니다."
 ],
 "Eine Plan-Datei enthält alle Season- und Layout-Varianten. Beim Öffnen kehrst du zum zuletzt aktiven Kartenstand zurück.": [
  "One plan file contains all season and layout variants. Opening it restores the map you last worked on.",
  "Un fichier contient toutes les variantes de saison et de disposition. À l’ouverture, vous retrouvez la dernière carte active.",
  "Un archivo contiene todas las variantes de temporada y distribución. Al abrirlo, vuelves al último mapa activo.",
  "Um arquivo contém todas as variantes de temporada e disposição. Ao abri-lo, você volta ao último mapa ativo.",
  "Một tệp chứa tất cả biến thể mùa và bố cục. Khi mở, bạn trở lại bản đồ hoạt động gần nhất.",
  "파일 하나에 모든 시즌과 배치 변형이 포함됩니다. 열면 마지막으로 작업한 지도가 복원됩니다."
 ],
 "Alle Varianten gespeichert. Beim Öffnen wird auch die aktive Season und das aktive Layout wiederhergestellt.": [
  "All variants saved. Opening the file also restores the active season and layout.",
  "Toutes les variantes sont enregistrées. L’ouverture du fichier restaure aussi la saison et la disposition actives.",
  "Todas las variantes guardadas. Al abrir el archivo también se restauran la temporada y la distribución activas.",
  "Todas as variantes foram salvas. Ao abrir o arquivo, a temporada e a disposição ativas também são restauradas.",
  "Đã lưu mọi biến thể. Khi mở tệp, mùa và bố cục đang hoạt động cũng được khôi phục.",
  "모든 변형이 저장되었습니다. 파일을 열면 활성 시즌과 배치도 복원됩니다."
 ],
 "Alle Varianten geladen. Der zuletzt aktive Kartenstand ist geöffnet.": [
  "All variants loaded. Your last active map is open.",
  "Toutes les variantes sont chargées. La dernière carte active est ouverte.",
  "Todas las variantes cargadas. Está abierto el último mapa activo.",
  "Todas as variantes foram carregadas. O último mapa ativo está aberto.",
  "Đã tải mọi biến thể. Bản đồ hoạt động gần nhất đang mở.",
  "모든 변형을 불러왔습니다. 마지막 활성 지도가 열렸습니다."
 ],
 "Einzelplan geladen. Weitere Varianten stehen separat bereit.": [
  "Single plan loaded. Other variants are available separately.",
  "Plan individuel chargé. Les autres variantes sont disponibles séparément.",
  "Plano individual cargado. Las demás variantes están disponibles por separado.",
  "Plano individual carregado. As outras variantes estão disponíveis separadamente.",
  "Đã tải bản thiết kế đơn. Các biến thể khác có sẵn riêng biệt.",
  "단일 배치를 불러왔습니다. 다른 변형은 별도로 준비되어 있습니다."
 ],
 "Die Datei ersetzt alle aktuellen Varianten. Speichere deinen bisherigen Stand vorher. Mit Strg+Z kannst du das Öffnen rückgängig machen.": [
  "The file replaces all current variants. Save your current work first. Ctrl+Z can undo opening the file.",
  "Le fichier remplace toutes les variantes actuelles. Enregistrez votre travail avant de continuer. Ctrl+Z permet d’annuler l’ouverture.",
  "El archivo reemplaza todas las variantes actuales. Guarda tu trabajo antes. Ctrl+Z permite deshacer la apertura.",
  "O arquivo substitui todas as variantes atuais. Salve seu trabalho antes. Ctrl+Z permite desfazer a abertura.",
  "Tệp sẽ thay thế mọi biến thể hiện tại. Hãy lưu công việc trước. Ctrl+Z có thể hoàn tác việc mở tệp.",
  "파일이 현재의 모든 변형을 대체합니다. 현재 작업을 먼저 저장하세요. Ctrl+Z로 파일 열기를 되돌릴 수 있습니다."
 ],
 "Plan speichern sichert alle 21 Season- und Layout-Varianten mit ihren Objekten, Koordinaten und Zuweisungen. Spieler, Gruppen und Prioritäten gelten gemeinsam. PNG/SVG und CSV exportieren nur die geöffnete Variante.": [
  "Save plan stores all 21 season and layout variants with their objects, coordinates and assignments. Players, groups and priorities are shared. PNG/SVG and CSV export only the open variant.",
  "Enregistrer le plan sauvegarde les 21 variantes avec leurs objets, coordonnées et affectations. Joueurs, groupes et priorités sont communs. PNG/SVG et CSV exportent uniquement la variante ouverte.",
  "Guardar plano almacena las 21 variantes con sus objetos, coordenadas y asignaciones. Los jugadores, grupos y prioridades se comparten. PNG/SVG y CSV exportan solo la variante abierta.",
  "Salvar plano armazena as 21 variantes com seus objetos, coordenadas e atribuições. Jogadores, grupos e prioridades são compartilhados. PNG/SVG e CSV exportam apenas a variante aberta.",
  "Lưu bản thiết kế lưu cả 21 biến thể mùa và bố cục cùng đối tượng, tọa độ và phân chỗ. Người chơi, nhóm và mức ưu tiên được dùng chung. PNG/SVG và CSV chỉ xuất biến thể đang mở.",
  "배치 저장은 21개 시즌·배치 변형의 물체, 좌표, 배정을 모두 저장합니다. 플레이어, 그룹, 우선순위는 공유됩니다. PNG/SVG와 CSV는 열린 변형만 내보냅니다."
 ],
 "Die Plan-Datei ist zu groß (maximal 20 MB).": [
  "The plan file is too large (maximum 20 MB).",
  "Le fichier est trop volumineux (20 Mo maximum).",
  "El archivo es demasiado grande (máximo 20 MB).",
  "O arquivo é muito grande (máximo de 20 MB).",
  "Tệp quá lớn (tối đa 20 MB).",
  "파일이 너무 큽니다(최대 20MB)."
 ],
 "Das ist keine unterstützte Varianten-Datei.": [
  "This variant file format is not supported.",
  "Ce format de fichier de variantes n’est pas pris en charge.",
  "Este formato de archivo de variantes no es compatible.",
  "Este formato de arquivo de variantes não é compatível.",
  "Định dạng tệp biến thể này không được hỗ trợ.",
  "지원하지 않는 변형 파일 형식입니다."
 ],
 "Die Plan-Datei muss alle 21 Season- und Layout-Varianten enthalten.": [
  "The plan file must contain all 21 season and layout variants.",
  "Le fichier doit contenir les 21 variantes de saison et de disposition.",
  "El archivo debe contener las 21 variantes de temporada y distribución.",
  "O arquivo deve conter todas as 21 variantes de temporada e disposição.",
  "Tệp phải chứa đủ 21 biến thể mùa và bố cục.",
  "파일에는 21개 시즌·배치 변형이 모두 있어야 합니다."
 ],
 "Die aktive Variante fehlt in der Plan-Datei.": [
  "The active variant is missing from the plan file.",
  "La variante active est absente du fichier.",
  "Falta la variante activa en el archivo.",
  "A variante ativa está ausente no arquivo.",
  "Tệp thiếu biến thể đang hoạt động.",
  "파일에 활성 변형이 없습니다."
 ],
 "Eine Variante fehlt oder ist doppelt vorhanden.": [
  "A variant is missing or duplicated.",
  "Une variante est absente ou présente en double.",
  "Falta una variante o hay una duplicada.",
  "Uma variante está ausente ou duplicada.",
  "Một biến thể bị thiếu hoặc trùng lặp.",
  "변형이 없거나 중복되었습니다."
 ],
 "Ungültige Variante.": [
  "Invalid variant.",
  "Variante invalide.",
  "Variante no válida.",
  "Variante inválida.",
  "Biến thể không hợp lệ.",
  "잘못된 변형입니다."
 ],
 "Füllbereich: {corner}": [
  "Fill area: {corner}",
  "Zone à remplir : {corner}",
  "Área de relleno: {corner}",
  "Área de preenchimento: {corner}",
  "Vùng lấp đầy: {corner}",
  "채우기 영역: {corner}"
 ],
 "{w} × {h} Felder · {n} neue Basen · {blocked} blockierte Plätze": [
  "{w} × {h} tiles · {n} new bases · {blocked} blocked positions",
  "{w} × {h} cases · {n} nouvelles bases · {blocked} emplacements bloqués",
  "{w} × {h} casillas · {n} bases nuevas · {blocked} posiciones bloqueadas",
  "{w} × {h} quadrados · {n} novas bases · {blocked} posições bloqueadas",
  "{w} × {h} ô · {n} căn cứ mới · {blocked} vị trí bị chặn",
  "{w} × {h}칸 · 새 기지 {n}개 · 막힌 자리 {blocked}개"
 ],
 "Raster am Allianzzentrum: von innen nach außen, am Zentrum höchstens 1 Feld Abstand.": [
  "Grid anchored to the Alliance Center: inside out, with at most 1 tile between the center and the first bases.",
  "Grille ancrée au centre de l’alliance : de l’intérieur vers l’extérieur, avec au plus 1 case entre le centre et les premières bases.",
  "Cuadrícula anclada al centro de la alianza: del interior al exterior, con un máximo de 1 casilla entre el centro y las primeras bases.",
  "Grade ancorada no centro da aliança: de dentro para fora, com no máximo 1 quadrado entre o centro e as primeiras bases.",
  "Lưới neo tại trung tâm liên minh: từ trong ra ngoài, cách trung tâm tối đa 1 ô ở hàng căn cứ đầu tiên.",
  "연맹 센터를 기준으로 안쪽부터 바깥쪽으로 배치합니다. 센터와 첫 기지 사이 간격은 최대 1칸입니다."
 ],
 "Raster am Marshall: von innen nach außen.": [
  "Grid anchored to the Marshall: inside out.",
  "Grille ancrée au Marshall : de l’intérieur vers l’extérieur.",
  "Cuadrícula anclada al Marshall: del interior al exterior.",
  "Grade ancorada no Marshall: de dentro para fora.",
  "Lưới neo tại Marshall: từ trong ra ngoài.",
  "Marshall을 기준으로 안쪽부터 바깥쪽으로 배치합니다."
 ],
 "Ohne Zentrum bleibt das Raster am Kartenursprung ausgerichtet.": [
  "Without a center, the grid stays aligned to the map reference point.",
  "Sans centre, la grille reste alignée sur le point de référence de la carte.",
  "Sin centro, la cuadrícula sigue alineada con el punto de referencia del mapa.",
  "Sem centro, a grade permanece alinhada ao ponto de referência do mapa.",
  "Khi chưa có trung tâm, lưới vẫn căn theo điểm tham chiếu của bản đồ.",
  "센터가 없으면 지도의 기준점에 맞춰 격자를 유지합니다."
 ],
 "Ecken ziehen: Größe und Anzahl werden sofort aktualisiert. Am Eckpunkt funktionieren auch die Pfeiltasten (Umschalt: 5 Felder).": [
  "Drag the corners: size and base count update immediately. You can also use arrow keys on a focused corner (Shift: 5 tiles).",
  "Faites glisser les coins : la taille et le nombre de bases sont actualisés immédiatement. Les flèches fonctionnent aussi sur un coin sélectionné (Maj : 5 cases).",
  "Arrastra las esquinas: el tamaño y el número de bases se actualizan al instante. También puedes usar las flechas en una esquina enfocada (Mayús: 5 casillas).",
  "Arraste os cantos: o tamanho e a quantidade de bases são atualizados imediatamente. Também pode usar as setas em um canto selecionado (Shift: 5 quadrados).",
  "Kéo các góc: kích thước và số căn cứ cập nhật ngay. Cũng có thể dùng phím mũi tên khi chọn góc (Shift: 5 ô).",
  "모서리를 드래그하면 크기와 기지 수가 즉시 갱신됩니다. 모서리에 초점을 맞춘 뒤 화살표 키도 사용할 수 있습니다(Shift: 5칸)."
 ],
 "Bei 2 Feldern Abstand wird der mittlere Übergang auf 1 Feld verdichtet. Vorhandene Objekte bleiben an ihrer Position.": [
  "With 2-tile spacing, the central transition is tightened to 1 tile. Existing objects stay in their positions.",
  "Avec un espacement de 2 cases, la transition centrale est resserrée à 1 case. Les objets existants restent à leur place.",
  "Con una separación de 2 casillas, la transición central se reduce a 1 casilla. Los objetos existentes permanecen en su lugar.",
  "Com espaçamento de 2 quadrados, a transição central é reduzida a 1 quadrado. Os objetos existentes permanecem nas suas posições.",
  "Khi chọn khoảng cách 2 ô, đoạn chuyển tiếp ở giữa được thu hẹp còn 1 ô. Các đối tượng hiện có giữ nguyên vị trí.",
  "2칸 간격을 선택하면 중앙 연결 구간은 1칸으로 좁아집니다. 기존 오브젝트의 위치는 유지됩니다."
 ]
};
let language='de';
try{const saved=root.localStorage?.getItem('nova-hive-language');if(languages.includes(saved))language=saved;}catch{}
function t(key,params={}){
 const value=language==='de'?key:messages[key]?.[columns.indexOf(language)]??key;
 return String(value).replace(/\{(\w+)\}/g,(_,name)=>String(params[name]??'{'+name+'}'));
}
function setLanguage(value){if(!languages.includes(value))return false;language=value;try{root.localStorage?.setItem('nova-hive-language',value);}catch{}return true;}
function apply(document){
 document.documentElement.lang=language;
 for(const el of document.querySelectorAll('[data-i18n]'))el.textContent=t(el.dataset.i18n);
 for(const attribute of ['aria-label','title','placeholder','content'])for(const el of document.querySelectorAll('[data-i18n-'+attribute+']'))el.setAttribute(attribute,t(el.getAttribute('data-i18n-'+attribute)));
}
root.HiveI18n={languages,columns,messages,t,setLanguage,apply,get language(){return language;}};
})(globalThis);
