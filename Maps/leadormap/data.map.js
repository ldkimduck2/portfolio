// data_map.js
const MAP_DATA = [
  {
    title: "쌍둥이 육각탑",
    size: "large", // 크기 지정: "large" (대형), "mid" (중형), "small" (소형)
    tags: ["레거시 던전", "수직 구조"],
    desc: "지도 상단에 위치한 거대한 석조 건축물입니다. 끊어진 다리와 절벽을 활용한 입체적인 레벨 디자인이 특징입니다.",
    metrics: { time: "1,500s+", size: "25,000 uu", actors: "40+" },
    traversal: { distance: "약 1,500m (거주지 기준)", run: "2분 40초", mount: "1분 5초" },
    coords: { y: 0.750, x: 0.420 }, // 맵 상의 Y, X 비율 좌표 (클릭 툴로 딴 좌표 입력)
    details: [
      { label: "루트 설계", text: "끊어진 다리(Broken Bridge)를 통해 정면 진입을 막고, 탑 하단의 암벽을 타고 올라가는 우회로(Bypass) 강제" }
    ]
  },
  {
    title: "찬란한 황금의 뿌리",
    size: "mid", 
    tags: ["특수 구역", "랜드마크"],
    desc: "우측에 거대하게 뻗어 있는 황금빛 나무의 군락입니다. 특별한 영체나 기도를 획득할 수 있는 보상 구역입니다.",
    metrics: { time: "300s", size: "6500 uu", actors: "12" },
    traversal: { distance: "약 800m (거주지 기준)", run: "1분 15초", mount: "30초" },
    coords: { y: 0.350, x: 0.750 },
    details: [
      { label: "아트 & 디자인", text: "어두운 맵 톤과 대비되는 강렬한 황금색 발광체를 배치하여 플레이어의 호기심과 탐험 욕구를 강하게 자극" }
    ]
  },
  {
    title: "잊혀진 자들의 거주지",
    size: "small",
    tags: ["시작 지점", "튜토리얼"],
    desc: "지도 좌측 중앙에 위치한 부서진 거주지 잔해입니다. 플레이어가 가장 처음 조작을 익히는 구역입니다.",
    metrics: { time: "90s", size: "1200 uu", actors: "5" },
    traversal: { distance: "시작 지점", run: "-", mount: "-" },
    coords: { y: 0.400, x: 0.280 },
    details: [
      { label: "배치 의도", text: "상단의 거대한 육각탑을 올려다보며 자연스럽게 목표를 인지하게 하는 시야각 제공" }
    ]
  }
  // 👇 새로운 POI를 추가하려면 위의 덩어리를 복사해서 여기에 붙여넣기만 하시면 됩니다!
];