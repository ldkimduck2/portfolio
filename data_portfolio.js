const PORTFOLIO_DATA = [
  {
    title: "Leador",
    date: "2025.08.25 — 2026.03.--", // 👈 프로젝트 제작 기간
    desc: "오픈월드 액션RPG 소울라이크", // 설명 글
    tags: ["!ELDEN RING", "Unreal Engine 5", "Dark Fantasy", "창작"], //태그
    youtubeId: "vBcbqNlE1d0", // 비디오 링크
    thumb: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop", // 이미지 슬라이더
    pdfUrl: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf", // PDF 주소
    overviewImages: [
      "img/LTD/ov/01.png",
      "img/LTD/ov/02.png",
      "img/LTD/ov/03.png"
    ],
    processImages: [
      "img/LTD/ov/01.png",
      "img/LTD/ov/02.png",
      "img/LTD/ov/03.png"
    ],
    meta: {
      genre: "오픈월드 액션RPG",
      size: "255 x 310 x 55",
      story: "폐쇄된 구역을 탐색하며 숨겨진 진실을 찾아가는 여정",
      intent1: { title: "내러티브", desc: "시퀀스에 따라 플레이어 동선과 이벤트를 자연스럽게 연결" },
      intent2: { title: "전투/탐험", desc: "전투의 긴장감, 탐험의 몰입감을 유기적으로 엮는 구성" },
      intent3: { title: "시선 유도", desc: "랜드마크, 조명 등 별도의 설명 없이 플레이 동선을 유도하는 설계" }
    },
  },
  {
    title: "Left To Decay",
    date: "2025.03.21 — 2025.04.07", // 👈 프로젝트 제작 기간
    desc: "3인칭 액션 어드벤처", // 설명 글
    tags: ["!LAST OF US", "Unreal Engine 5", "포스트 아포칼립스", "창작"], //태그
    youtubeId: "sKNml5GIzbo", // 비디오 링크
    thumb: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop", // 이미지 슬라이더
    pdfUrl: "pdf/김기덕_액션어드벤처 레벨기획서.pdf", // PDF 주소
    overviewImages: [
      "img/LTD/ov/01.png",
      "img/LTD/ov/02.png",
      "img/LTD/ov/03.png",
      "img/LTD/ov/04.png",
      "img/LTD/ov/05.png",
      "img/LTD/ov/06.png"
    ],
    processImages: [
      "img/LTD/pc/01.png",
      "img/LTD/pc/02.png",
      "img/LTD/pc/03.png",
      "img/LTD/pc/04.png",
      "img/LTD/pc/05.png",
      "img/LTD/pc/06.png",
      "img/LTD/pc/07.png",
      "img/LTD/pc/08.png"
    ],
    meta: {
      genre: "3인칭 액션 어드벤처",
      size: "255 x 310 x 55",
      story: "붕괴된 도시를 탐색하며 가족의 흔적을 찾아가는 여정",
      intent1: { title: "내러티브", desc: "시퀀스에 따라 플레이어 동선과 이벤트를 자연스럽게 연결" },
      intent2: { title: "전투,탐험,퍼즐 구간의 조화", desc: "전투의 긴장감, 탐험의 몰입감을 유기적으로 엮는 구성" },
      intent3: { title: "시선 유도", desc: "랜드마크, POI, 조명 등 별도의 설명 없이 플레이 동선을 유도하는 설계" }
    },
  },
  {
    title: "Nova Core",
    date: "2025.01.04 — 2025.02.02", // 👈 프로젝트 제작 기간
    desc: "3인칭 잠입 액션", // 설명 글
    tags: ["!Tom Clancy’s : Splinter Cell", "Unreal Engine 5","설산", "창작"], //태그
    youtubeId: "otSQADvZ9pM", // 비디오 링크
    thumb: "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=1200&auto=format&fit=crop", // 이미지 슬라이더
    pdfUrl: "pdf/김기덕_잠입액션 레벨기획서.pdf", // PDF 주소
    overviewImages: [
      "img/NC/ov/01.png",
      "img/NC/ov/02.png",
      "img/NC/ov/03.png",
      "img/NC/ov/04.png",
      "img/NC/ov/05.png",
      "img/NC/ov/06.png",
      "img/NC/ov/07.png",
      "img/NC/ov/08.png",
      "img/NC/ov/09.png",
      "img/NC/ov/10.png"
    ],
    processImages: [
      "img/NC/pc/01.png",
      "img/NC/pc/02.png",
      "img/NC/pc/03.png",
      "img/NC/pc/04.png",
      "img/NC/pc/05.png"
    ],
    meta: {
      genre: "3인칭 잠입 액션",
      size: "210 x 170 x 40",
      story: "눈 덮인 산속 연구소에서 비밀을 밝혀내기 위해 시작되는 잠입 작전 ",
      intent1: { title: "스텔스 경험", desc: "플레이어가 최대한 신중하고 천천히 진행하도록 유도하는 스텔스 레벨 설계" },
      intent2: { title: "동적인 환경", desc: "적AI 순찰 루트, 해킹 가능한 문, 달려오는 트럭, 기차 등 플레이어의 행동 혹은 선택에 따라 반응 할 수있는 레벨 설계" },
      intent3: { title: "다중 경로 제공", desc: "은밀하게 우회하거나 위험을 감수하고 빠르게 돌파하는 등, 플레이 스타일에 맞는 전략적 플레이 가능" }
    },
  }
];