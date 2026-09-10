const STUDY_DATA = [
  {
  cat: "System Design",
  title: "소울라이크 전투 시스템",
  date: "2026. 06",
  desc: "레벨을 만들면서 전투 시스템의 수치가 공간에 어떤 영향을 주는지 직접 확인해보고 싶어 만든 소울라이크 전투 프로토타입입니다.",
  coverImage: "img/DSP/DarkSoulsProject_Big_720.png",
  youtubeId: "3H-1v8gK5qM",

  content: `
<div class="sys-doc-head">
  <span class="sys-doc-kicker">SYSTEM DESIGN / UE5 COMBAT PROTOTYPE</span>
  <h2>Soulslike Combat System</h2>
  <p>공격, 방어, AI, 성장 시스템을 직접 만들고 실제 레벨에 필요한 수치들을 정리했습니다.</p>
</div>

---

### 01. 왜 만들었나

레벨을 만들면서 항상 궁금했던 부분이 있었습니다.

공격 사거리나 회피 거리, 락온 거리, 적의 인지 범위 같은 값이 바뀌면  
같은 공간에서도 전투 느낌이 얼마나 달라지는지 직접 확인해보고 싶었습니다.

기존에는 레벨만 만들다 보니 이미 만들어진 시스템 위에서 공간을 구성하는 경우가 많았습니다.  
그런데 시스템이 어떤 식으로 움직이는지 모르고서는 전투 공간의 크기나 적 배치 간격을 잡을 때 결국 감에 의존하는 부분이 생겼습니다.

처음에는 Fab에서 소울라이크 전투 프레임워크를 구매해서 사용하려고 했습니다.  
필요한 기능이 들어간 프레임워크 가격이 약 40만 원 정도였고, 그 정도 비용이면 차라리 직접 만들어보면서 배우는 게 낫겠다고 생각했습니다.

그래서 공격, 회피, 가드, 패링, 스태미나, 락온, 적 AI 같은 기능부터 하나씩 만들기 시작했습니다.

이 프로젝트의 목적은 완성된 게임을 만드는 것이 아니라,  
**전투 시스템이 어떻게 돌아가고 그 값들이 레벨디자인에 어떤 영향을 주는지 직접 확인하는 것**이었습니다.

<div class="sys-purpose-grid">
  <div><span>01</span><strong>전투 거리</strong><small>공격 · 회피 · 락온 · AI 거리</small></div>
  <div><span>02</span><strong>행동 자원</strong><small>공격과 방어에 쓰이는 Stamina</small></div>
  <div><span>03</span><strong>적 배치</strong><small>인지 · 접근 · 공격 간격</small></div>
</div>

#### 시스템 값이 레벨에 주는 영향

| 시스템 값 | 레벨에서 확인할 부분 |
| :--- | :--- |
| 공격 사거리 | 플레이어와 적이 실제로 맞붙는 거리 |
| 회피 거리 | 회피할 수 있는 공간 여유 |
| Stamina Cost | 공격 후 방어 행동을 얼마나 남길 수 있는지 |
| Lock-on Range | 한 전투 공간의 크기 |
| AI Sight Range | 적이 플레이어를 발견하는 시점과 배치 간격 |
| Melee Attack Range | 실제 근접 교전 거리 |
| Poise | 한 적을 상대할 때 필요한 공격 횟수 |
| Bonfire 위치 | 한 번에 진행하게 되는 전투 구간 길이 |

---

### 02. 시스템 구성

<div class="system-summary-grid">
  <div class="system-summary-card">
    <span>HP</span>
    <strong>생존</strong>
    <small>피격과 사망 처리</small>
  </div>
  <div class="system-summary-card">
    <span>STA</span>
    <strong>행동 자원</strong>
    <small>공격 · 회피 · 가드 비용</small>
  </div>
  <div class="system-summary-card">
    <span>POI</span>
    <strong>강인도</strong>
    <small>피격 리액션 · 그로기</small>
  </div>
</div>

기능은 한 곳에 몰아넣지 않고 역할별로 나눴습니다.

| 시스템 | 역할 | 상태 |
| :--- | :--- | :---: |
| AC_Status | HP / Stamina / Poise, 액션 상태, 콤보, 선입력 | <span class="sys-status done">구현</span> |
| WeaponData | 무기 데미지, Stamina 비용, 스케일링, 몽타주 | <span class="sys-status done">구현</span> |
| ANS_HitResult | 무기 소켓 기반 공격 Trace, 중복 타격 방지 | <span class="sys-status done">구현</span> |
| AC_HitReaction | 피격, 가드, 패링, 강인도, 처형 가능 상태 | <span class="sys-status done">구현</span> |
| AC_LockOn | 타깃 탐색 · 전환 · 거리 해제 | <span class="sys-status done">구현</span> |
| StateTree AI | 인지 · 접근 · 공격 · 후퇴 · 재탐색 | <span class="sys-status done">구현</span> |
| CombatManager | 공격 토큰 · 8방향 위치 슬롯 | <span class="sys-status partial">AI 연동 필요</span> |
| Bonfire / Rune | 체크포인트 · 회복 · 레벨업 · 사망 소울 회수 | <span class="sys-status done">구현</span> |

---

### 03. 플레이어 행동

| 행동 | 조건 | 비용 | 결과 |
| :--- | :--- | :---: | :--- |
| Light Attack | 무기 장착 / 회피 중 아님 | 15 | 약공격 콤보 |
| Heavy Attack | 무기 장착 / 회피 중 아님 | 25 | 강공격 / 차지 가능 |
| Dodge | Stamina 충분 / 방향 입력 | 15 | I-Frame + 위치 변경 |
| Guard | 가드 입력 유지 | 지속 소모 | 피해 완화 |
| Parry | 패링 입력 / 유효 타이밍 | 20 | 성공 시 처형 기회 |
| Heal | Estus 보유 / 공격·피격 중 아님 | Estus 1 | HP 회복 |
| Sprint | 질주 입력 / 이동 가능 상태 | 지속 | 이동 속도 증가 |
| Jump | **질주 중일 때만 가능** | - | 점프 |

점프는 기본 상태에서 바로 쓸 수 없고, Blueprint에서 **질주 중일 때만 실행되도록 제한**했습니다.

---

### 04. 공격 / 콤보 / 선입력

공격 중 다음 입력이 들어오면 바로 실행하지 않고 최대 **0.5초 동안 저장**합니다.

<div class="sys-flow">
  <div class="sys-flow-title">ATTACK / INPUT BUFFER</div>
  <div class="sys-flow-line">
    <div class="sys-flow-box"><b>Input</b><span>Light / Heavy / Dodge</span></div>
    <i>→</i>
    <div class="sys-flow-box"><b>행동 가능?</b><span>현재 상태 확인</span></div>
    <i>→</i>
    <div class="sys-flow-box accent"><b>즉시 실행</b><span>가능한 경우</span></div>
  </div>
  <div class="sys-flow-branch">공격 중이라면</div>
  <div class="sys-flow-line">
    <div class="sys-flow-box"><b>입력 저장</b><span>최대 0.5초</span></div>
    <i>→</i>
    <div class="sys-flow-box"><b>현재 공격 종료</b><span>몽타주 종료</span></div>
    <i>→</i>
    <div class="sys-flow-box accent"><b>예약 행동 실행</b><span>ProcessQueuedInput()</span></div>
  </div>
</div>

회피 입력은 공격보다 우선하도록 했습니다.  
공격이 예약되어 있더라도 회피 입력이 들어오면 공격 큐를 지우고 회피를 먼저 실행합니다.

---

### 05. 공격 판정

공격이 실제로 맞는 구간은 Anim Notify State로 정했습니다.

<div class="sys-flow">
  <div class="sys-flow-title">HIT RESOLUTION</div>
  <div class="sys-flow-line wide">
    <div class="sys-flow-box"><b>Notify Begin</b><span>HitActors 초기화</span></div>
    <i>→</i>
    <div class="sys-flow-box"><b>Weapon Trace</b><span>StartSocket → EndSocket</span></div>
    <i>→</i>
    <div class="sys-flow-box"><b>Hit Payload</b><span>Damage / Poise / 방향</span></div>
    <i>→</i>
    <div class="sys-flow-box"><b>방어 상태 확인</b><span>I-Frame / Guard / Parry</span></div>
    <i>→</i>
    <div class="sys-flow-box accent"><b>결과 적용</b><span>피해 / 리액션 / 그로기</span></div>
  </div>
</div>

한 번의 공격에서 같은 적이 여러 번 맞는 것을 막기 위해 공격 시작 시 HitActors를 비우고, 이미 맞은 대상은 다시 처리하지 않도록 했습니다.

---

### 06. 회피 / 가드 / 패링

세 기능은 모두 방어 수단이지만 쓰는 이유는 다르게 잡았습니다.

| 행동 | 성공 조건 | 비용 / 실패 | 성공했을 때 |
| :--- | :--- | :--- | :--- |
| Dodge | 공격 판정과 I-Frame이 겹침 | Stamina 15 / 방향 선택 실패 시 피격 | 피해 무효 + 위치 변경 |
| Guard | 가드 중 전방 공격 | Stamina 지속 소모 | 피해 완화 |
| Parry | Parry Window에 공격 적중 | Stamina 20 / 실패 시 피격 | 적 Executable |

<div class="sys-flow">
  <div class="sys-flow-title">DEFENSE CHECK</div>
  <div class="sys-flow-line">
    <div class="sys-flow-box"><b>Enemy Hit</b><span>공격 판정</span></div>
    <i>→</i>
    <div class="sys-flow-box"><b>I-Frame?</b><span>Dodge</span></div>
    <i>→</i>
    <div class="sys-flow-box"><b>Parry?</b><span>Parry Window</span></div>
    <i>→</i>
    <div class="sys-flow-box"><b>Guard?</b><span>전방 가드</span></div>
    <i>→</i>
    <div class="sys-flow-box accent"><b>Damage</b><span>일반 피격</span></div>
  </div>
</div>

---

### 07. 패링 / 그로기 / 처형

패링에 성공하거나 적의 Poise를 전부 깎으면 처형 가능한 상태가 됩니다.

<div class="sys-flow">
  <div class="sys-flow-title">PARRY / EXECUTION</div>
  <div class="sys-flow-line wide">
    <div class="sys-flow-box"><b>패링 성공</b><span>또는 Poise 붕괴</span></div>
    <i>→</i>
    <div class="sys-flow-box"><b>Groggy</b><span>Executable = True</span></div>
    <i>→</i>
    <div class="sys-flow-box"><b>조건 확인</b><span>거리 / 방향 / 위치</span></div>
    <i>→</i>
    <div class="sys-flow-box"><b>위치 정렬</b><span>공격자 · 대상</span></div>
    <i>→</i>
    <div class="sys-flow-box accent"><b>Execution</b><span>전용 Montage</span></div>
  </div>
</div>

| 처형 | 조건 | 기본 피해 |
| :--- | :--- | ---: |
| Riposte | Executable 상태 + 전방 Trace | 150 |
| Backstab | 후방 각도 + 거리 조건 | 120 |

---

### 08. 전투 데이터

<div class="system-number-grid">
  <div class="system-number-card"><strong>100</strong><span>Max HP</span><small>Vigor 10 초과당 +20</small></div>
  <div class="system-number-card"><strong>100</strong><span>Max Stamina</span><small>Endurance 10 초과당 +10</small></div>
  <div class="system-number-card"><strong>100</strong><span>Max Poise</span><small>피격 / 그로기 기준</small></div>
  <div class="system-number-card"><strong>5</strong><span>Estus</span><small>화톳불에서 보충</small></div>
</div>

#### WeaponData

무기 관련 값은 DataTable이 아니라 **WeaponData DataAsset**에서 관리했습니다.

| 항목 | Light | Heavy |
| :--- | ---: | ---: |
| Base Damage | 20 | 35 |
| Poise Damage | 10 | 25 |
| Stamina Cost | 15 | 25 |
| Charge | - | Multiplier 적용 |

<div class="system-formula">
  <span>Damage Scaling</span>
  <strong>BaseDamage + BaseDamage × (Scaling% / 100) × Clamp((Strength − 1) / 99) × 2</strong>
</div>

---

### 09. 락온

락온 중에는 카메라뿐 아니라 플레이어의 이동과 회전 기준도 대상 중심으로 바뀝니다.

| 항목 | 값 | 용도 |
| :--- | ---: | :--- |
| LockOnRange | 2500 | 처음 타깃을 찾는 거리 |
| MaxLockOnDistance | 3500 | 자동으로 락온이 풀리는 거리 |
| SwitchTarget | 방향 입력 | 다음 타깃 선택 |
| Camera Rotation | 보간 | 대상 중심 카메라 유지 |

락온 거리는 전투 공간 크기를 볼 때 생각보다 영향을 많이 주는 값이었습니다.  
공간이 너무 넓으면 타깃이 쉽게 풀리고, 반대로 너무 좁으면 다수전에서 카메라가 답답해졌습니다.

---

### 10. 적 AI

적 AI는 StateTree로 구성했습니다.

<div class="sys-flow">
  <div class="sys-flow-title">ENEMY COMBAT</div>
  <div class="sys-flow-line wide">
    <div class="sys-flow-box"><b>Peaceful</b><span>대기 / 배회</span></div>
    <i>→</i>
    <div class="sys-flow-box"><b>Perception</b><span>시야 / 청각</span></div>
    <i>→</i>
    <div class="sys-flow-box"><b>Approach</b><span>공격 거리까지 접근</span></div>
    <i>→</i>
    <div class="sys-flow-box accent"><b>Attack</b><span>일반 / 특수 공격</span></div>
    <i>→</i>
    <div class="sys-flow-box"><b>Reposition</b><span>거리 조절</span></div>
  </div>
</div>

| AI 데이터 | 값 |
| :--- | ---: |
| Sight Radius | 1000 |
| Lose Sight Radius | 1200 |
| Peripheral Vision | 60° |
| Hearing Range | 1000 |
| Sight Max Age | 5 sec |
| Hearing Max Age | 3 sec |
| Melee Attack Range | 200 |

플레이어를 놓치면 마지막으로 본 위치를 저장하고 그 위치까지 확인한 뒤 다시 탐색하도록 했습니다.

---

### 11. 다대일 전투

여러 적이 동시에 달려들면 전투를 읽기 어려워져서, 공격 토큰과 위치 슬롯도 만들어봤습니다.

<div class="system-dual-card">
  <div><strong>1</strong><span>Attack Token</span><small>동시에 적극적으로 공격하는 적 수 제한</small></div>
  <div><strong>8</strong><span>Position Slot</span><small>플레이어 주변을 45° 간격으로 분할</small></div>
</div>

현재 CombatManager 안에 토큰과 슬롯 기능은 구현되어 있지만, 실제 StateTree 공격 Task와 연결하는 작업은 남아 있습니다.

---

### 12. 사망 / Souls / Rune

사망 이후 흐름은 Blueprint에서 연결했습니다.

<div class="sys-flow important">
  <div class="sys-flow-title">DEATH / RUNE</div>
  <div class="sys-flow-line wide">
    <div class="sys-flow-box danger"><b>Player Death</b><span>HP ≤ 0</span></div>
    <i>→</i>
    <div class="sys-flow-box"><b>Souls 저장</b><span>Current → Dropped</span></div>
    <i>→</i>
    <div class="sys-flow-box"><b>Current Souls = 0</b><span>현재 소울 초기화</span></div>
    <i>→</i>
    <div class="sys-flow-box"><b>Map Restart</b><span>레벨 다시 시작</span></div>
    <i>→</i>
    <div class="sys-flow-box accent"><b>Rune 생성</b><span>이전 사망 위치</span></div>
  </div>
  <div class="sys-flow-bottom"><span>다시 사망 위치에 도착</span><b>→ Rune 회수 → Souls 복구</b></div>
</div>

이 흐름을 만들고 나니 화톳불 위치가 단순 체크포인트가 아니라,  
**지금 가진 Souls를 들고 더 진행할지 돌아갈지 결정하는 지점**이라는 것도 같이 보였습니다.

---

### 13. 화톳불 / 레벨업

화톳불에서는 체크포인트 설정, 회복, Estus 보충, 레벨업을 할 수 있습니다.

<div class="sys-flow important">
  <div class="sys-flow-title">BONFIRE</div>
  <div class="sys-flow-line wide">
    <div class="sys-flow-box"><b>상호작용</b><span>Bonfire 접근</span></div>
    <i>→</i>
    <div class="sys-flow-box accent"><b>활성화</b><span>체크포인트 지정</span></div>
    <i>→</i>
    <div class="sys-flow-box"><b>회복</b><span>HP / Stamina</span></div>
    <i>→</i>
    <div class="sys-flow-box"><b>Estus 보충</b><span>기본 5개</span></div>
    <i>→</i>
    <div class="sys-flow-box"><b>Level Up</b><span>활성화된 화톳불에서만</span></div>
  </div>
</div>

레벨업 UI는 아무 곳에서나 열 수 없고, **활성화된 화톳불에서만 열리도록 Blueprint에서 연결**했습니다.

<div class="system-formula">
  <span>Level Up Cost</span>
  <strong>Required Souls = 500 + Level² × 10</strong>
</div>

---

### 14. 레벨을 만들 때 같이 보는 값

이 프로젝트를 만든 이유와 가장 가까운 부분입니다.

| 항목 | 현재 값 | 레벨에서 보는 부분 |
| :--- | :--- | :--- |
| InputQueueWindow | 0.5 sec | 공격 템포 |
| Light / Heavy Cost | 15 / 25 | 공격 후 회피 여유 |
| Dodge Cost | 15 | 연속 회피 가능 횟수 |
| LockOnRange | 2500 | 전투 공간 크기 |
| MaxLockOnDistance | 3500 | 락온이 유지될 수 있는 최대 거리 |
| AI Sight Radius | 1000 | 적을 처음 발견하는 위치 |
| Melee Attack Range | 200 | 실제 교전 거리 |
| Max Poise | 100 | 그로기까지 필요한 공격 횟수 |
| Bonfire | 체크포인트 | 한 전투 구간의 길이 |

수치 자체가 정답이라고 생각하지는 않았습니다.

이 값들을 직접 바꿔보고 플레이해보면서  
**공간을 넓혀야 하는지, 적 사이를 더 벌려야 하는지, 전투 구간을 짧게 가져가야 하는지** 판단할 수 있는 기준을 만들고 싶었습니다.

---

### 15. 개선할 부분

| 우선순위 | 항목 | 현재 상태 | 개선 방향 |
| :---: | :--- | :--- | :--- |
| P0 | Stamina Cost | 일부 행동 가능 판정에서 Cost 확인이 느슨함 | 실제 행동 Cost 기준으로 통일 |
| P0 | 상태 관리 | State와 Boolean Flag가 같이 사용됨 | 역할을 나눠 정리 |
| P1 | CombatManager | 토큰·슬롯은 구현, AI와 미연동 | StateTree 공격 Task와 연결 |
| P1 | Rune 예외 처리 | 기본 사망 / 생성 / 회수 루프 구현 | 연속 사망 시 기존 Rune 처리 추가 |
| P2 | 전투 피드백 | 패링 성공이나 행동 실패 피드백이 부족함 | Sound / VFX / HUD 추가 |
| P2 | 데이터 정리 | 일부 값이 코드와 Component에 나뉘어 있음 | 조절 값들을 DataAsset 쪽으로 정리 |

앞으로는 기능을 더 많이 붙이는 것보다,  
현재 만들어둔 시스템을 실제 전투 레벨에 넣고 **수치를 바꿨을 때 공간과 전투가 어떻게 달라지는지 비교해보는 것**을 먼저 해볼 생각입니다.
`
},

/// Next ///

{
cat: "Tools & Workflow",
title: "모듈러 배치 작업을 줄이기 위해 만든 MeshSnapTools",
date: "2026. 06",
desc: "모듈러 메쉬를 배치할 때 모서리나 버텍스를 맞추기 위해 위치를 조금씩 조정하는 작업이 반복돼, 원하는 지점을 직접 찍어 붙일 수 있도록 만든 UE5 에디터 플러그인입니다.",
coverImage: "img/MeshSnapTools/MeshSnapTools_v2.png",
youtubeId: "bWaVvlLsYes",

content: `
### 왜 만들었나

레벨을 만들다 보면 벽, 기둥, 문틀 같은 모듈러 메쉬를 계속 이어 붙이게 됩니다.

그리드 스냅으로 바로 맞는 경우도 있지만, 피벗 위치가 애매하거나 서로 다른 형태의 메쉬를 붙일 때는 모서리나 버텍스를 기준으로 위치를 맞춰야 했습니다. 그럴 때마다 이동 기즈모로 X, Y, Z 값을 조금씩 조절해서 맞추는 작업이 반복됐습니다.

특히 같은 벽을 여러 개 이어 붙이거나, 문과 문틀처럼 여러 액터를 같이 옮길 때 이 과정이 계속 생겨서 작업 흐름이 자주 끊겼습니다.

그래서 **메쉬에서 원하는 지점을 하나 찍고, 다른 메쉬의 원하는 지점에 바로 붙일 수 있는 기능**을 만들었습니다. 같은 메쉬를 반복해서 배치할 때는 복제와 스냅도 한 번에 할 수 있도록 했습니다.

---

### 기능 / 조작 방법

**1. 액터 선택**  
스냅할 액터를 선택하면 사용할 수 있는 스냅 포인트가 표시됩니다.

**2. 기준점 선택**  
원하는 포인트를 좌클릭하면 해당 지점이 기준점으로 잡힙니다.

**3. 붙일 위치 선택**  
다른 액터에 마우스를 올리면 가까운 스냅 포인트가 표시되고, 실제로 이동했을 때의 위치를 와이어프레임으로 미리 볼 수 있습니다.

**4. Space - 이동 후 스냅**  
원하는 포인트에 마우스를 올린 상태에서 \`Space\`를 누르면 기준점과 목표점이 맞도록 액터가 이동합니다.

**5. Shift + Space - 복제 후 스냅**  
원본은 그대로 두고 복제된 액터를 목표 위치에 붙입니다. 복제된 액터가 다시 선택되기 때문에 같은 벽이나 기둥을 연속해서 배치할 때 사용할 수 있습니다.

**6. 여러 액터 같이 스냅**  
여러 액터를 선택한 뒤 그중 하나의 스냅 포인트를 기준으로 잡으면, 나머지 액터도 상대 위치를 유지한 채 같이 이동하거나 복제됩니다.

이동과 복제는 Unreal Editor의 Transaction으로 처리해서 \`Ctrl + Z\`로 되돌릴 수 있습니다.

---

### 개선하고 싶은 부분

현재는 위치를 맞추는 기능만 있어서, 회전된 메쉬끼리 면 방향까지 맞춰주는 기능은 없습니다. 이후에는 필요하다면 **회전 정렬**도 추가해보고 싶습니다.

버텍스가 많은 메쉬는 스냅 포인트도 많아져 화면이 복잡해질 수 있습니다. 그래서 **모서리 / 면 중심 / 버텍스처럼 표시할 포인트 종류를 나눠서 켜고 끌 수 있는 기능**이 있으면 더 편할 것 같습니다.

또 현재 단축키로 사용하는 \`Space\`는 Unreal Editor의 기본 조작과 겹칠 가능성이 있어, 실제 작업에서 계속 사용해 보면서 별도의 단축키로 바꾸는 것도 고려하고 있습니다.

마지막으로 피벗을 잡은 뒤 선택된 액터 구성이 바뀌면 미리보기 캐시가 바로 갱신되지 않는 경우가 있어, 선택 변경 시 자동으로 갱신되도록 개선할 수 있습니다.
`
},

/// Next ///

{ 
    cat: "Level Design Theory", 
    title: "GDC - God Of War Level Design", 
    date: "2026. 02. 13", 
    desc: "2018년작 <God Of War> '스톤 메이슨' 레벨을 통해 알아보는 레벨 디자인을 지탱하는 6가지 핵심 규칙과 개발 비하인드 분석.",
    coverImage: "https://duck3d.notion.site/image/attachment%3A0d19b8dd-a1a9-4829-a49d-9e88369eccce%3A%EC%8A%A4%ED%81%AC%EB%A6%B0%EC%83%B7_2026-02-13_050951.png?table=block&id=305fcdf9-9754-80af-af84-d14438ffcbc8&spaceId=92715d94-9439-418c-9b51-0971d96b93aa&width=2000&userId=&cache=v2", 
    youtubeId: "eSB29qx6sWw", 
    
    // 🔥 번역기가 헷갈리지 못하도록 빈틈없이 수정 완료! 🔥
    content: `
이 강연은 2018년작 <strong>&lt;God Of War&gt;</strong>의 레벨 디자인을 지탱하는 6가지 핵심 규칙을 ‘스톤 메이슨’ 레벨을 예시로 들어 설명하고 있습니다.

### 🎯 서론 : 목적
이 강연은 방대한 게임인 <strong>&lt;God of War&gt;</strong>의 개발 과정을 단순화하여, 다른 게임 개발자들에게도 적용될 수 있는 <strong>레벨 디자인의 6가지 규칙</strong>을 공유하는 것을 목표로 합니다. 발표자는 ‘스톤 메이슨’ 레벨이 이 6가지 규칙이 가장 잘 적용된 사례라고 소개합니다.

### 🏛️ 규칙 1 : 핵심기둥 (Core Pillars) 정의
개발 초기, 팀은 게임의 방향성을 결정짓는 <strong>핵심기둥(Core Pillars)</strong>을 정의합니다. 과거 시리즈의 기둥이 ‘전투, 플랫폼, 퍼즐’이었다면, 이번 신작의 새로운 기둥은 <strong>전투(Combat), 내러티브(Narrative), 탐험(Exploration)</strong> 3가지로 정했습니다.

이 세 가지 기둥은 모든 레벨 디자인의 기준점이 됩니다. 레벨 디자이너는 공간을 만들 때 항상 "이 공간이 전투, 내러티브, 탐험을 어떻게 충족시키는가?" 를 고민해야 합니다.

![핵심기둥3가지](https://duck3d.notion.site/image/attachment%3A02e007df-4f85-46a4-84d9-164008b33454%3Aimage.png?table=block&id=31ffcdf9-9754-8091-9285-e70cd8b6e0a3&spaceId=92715d94-9439-418c-9b51-0971d96b93aa&width=1420&userId=&cache=v2)
<span class="m-study-caption">사진 1. 핵심 기둥 3가지</span>

<div class="m-study-callout"><div class="m-study-callout-icon">💡</div><div class="m-study-callout-text">
<strong>'스톤 메이슨' 레벨 적용 사례</strong><br><br>
- <strong>전투 :</strong> 다양한 아레나와 보스전 배치<br>
- <strong>내러티브 :</strong> 쓰러진 거인(스톤 메이슨) 자체가 강력한 환경적 스토리텔링 장치를 하며, 크레토스와 아트레우스의 대화가 끊기지 않도록 설계<br>
- <strong>탐험 :</strong> 단순히 맵을 넓게 만드는 것이 아니라, 카메라를 자유롭게 돌릴 수 있게 됨에 따라 구석구석 숨겨진 요소를 배치하여 플레이어가 능동적으로 찾아보게 만듦
</div></div>

### 📏 규칙 2 : 메트릭 (Metrics) - 기둥을 치수로 변환
추상적인 ‘핵심기둥’을 실제 게임 공간으로 구현하기 위해서는 구체적인 <strong>치수(Metrics)</strong>가 필요합니다. 이를 위해 <strong>‘레벨 빌딩 코드’</strong> 라는 문서를 만들어 크레토스의 이동과 상호작용 규격을 표준화하였습니다.

![치수 변환 이미지](https://duck3d.notion.site/image/attachment%3A800724b1-8d95-42b6-a68e-1362827d40a3%3Aimage.png?table=block&id=31ffcdf9-9754-80ee-b64a-c55e263bb760&spaceId=92715d94-9439-418c-9b51-0971d96b93aa&width=1420&userId=&cache=v2)
<span class="m-study-caption">사진 2. 크레토스의 이동 규격과 3M 부스트</span>

- 크레토스가 벽을 타고 오르는 높이를 <strong>1M, 2M, 3M</strong> 등으로 규격화하였습니다.
- <strong>특히 3M 부스트는 가장 중요한 단위입니다.</strong> 이는 플레이어를 평면적인 공간에서 수직적으로 분리해주면서도, 흐름을 끊지 않을 정도로 적당한 높이입니다. (전투 공간 분리, 비밀 장소 숨기기에 유용)
- 이러한 치수(Metrics)가 통일되면, 플레이어는 무의식적으로 "저 높이는 올라갈 수 있겠다" 혹은 "저기는 전투 공간이다" 라는 리듬과 규칙을 자연스럽게 학습하게 되어 쾌적한 플레이가 가능해집니다.

### 🎭 규칙 3 : 다양성 확보 (Theme)
플레이어가 지루함을 느끼지 않게 하려면 모든 레벨이 각기 다른 강력한 테마를 가져야 합니다. 테마는 시각적인 것 뿐만 아니라 독특한 <strong>게임플레이 요소</strong>에서 비롯됩니다. 즉, 하나의 레벨에는 그 레벨을 관통하는 핵심 기믹이 있어야 합니다.

<div class="m-study-callout"><div class="m-study-callout-icon">🏹</div><div class="m-study-callout-text">
<strong>'스톤 메이슨' 레벨 적용 사례</strong><br><br>
이 레벨의 테마는 <strong>충격화살</strong>입니다. 레벨 전체가 붉은 수정을 폭파시키는 기믹을 중심으로 설계되어 있으며, 이러한 기믹은 플레이어로 하여금 <em>"아, 여기는 폭발하는 수정이 있는 곳이구나"</em> 라는 뚜렷한 인상을 남깁니다.
</div></div>

### 🔓 규칙 4 : 새로운 능력 해금 (Unlock a New Ability)
모든 주요 레벨은 약 <strong>90분~120분 마다 새로운 능력을 해금</strong>하도록 설계되었습니다. 새로운 능력을 얻는 것은 플레이어에게 가장 큰 보상이자 동기부여가 되며, 앞서 말한 ‘레벨의 테마’ 를 만드는 핵심 재료가 됩니다.

충격 화살은 아트레우스가 붉은 수정에 화살을 쏘면 폭발하는 단순한 메커니즘입니다. 하지만 이 단순함 덕분에 <strong>전투(광역 데미지), 탐험(길 뚫기), 내러티브(세계수 뿌리)</strong> 등 게임의 3대 기둥 모두에 적용할 수 있는 범용성을 가집니다. 단순한 능력이지만 이를 활용해 다양한 상황(퍼즐, 전투 보조)을 만들어내는 것이 레벨 디자인의 핵심입니다.

### 📐 규칙 5 : 형식과 탐험 휴식 (The Format & Exploration Break)
레벨의 흐름을 구조화하는 형식(Format)이 존재하며, 이는 일종의 <strong>‘삼각형 구조’</strong>로 설명됩니다.

![삼각형 구조](https://duck3d.notion.site/image/attachment%3Aede78bb7-d1a1-48e3-b6e8-c76f0f72b286%3Aimage.png?table=block&id=305fcdf9-9754-80c6-af76-cc6eff68938f&spaceId=92715d94-9439-418c-9b51-0971d96b93aa&width=1420&userId=&cache=v2)
<span class="m-study-caption">사진 3. 레벨 디자인의 삼각형 구조</span>

- <strong>초반 75% :</strong> 해당 레벨의 테마를 충분히 경험하게 합니다.
- <strong>전환점 (Key Turning Point) :</strong> 보스전이나 중요한 사건 발생. 여기서 새로운 능력 해금.
- <strong>후반 25% :</strong> 획득한 새 능력을 가르치는 튜토리얼 구간.
- <strong>마지막 :</strong> 탐험 휴식 제공.

<strong>🏝️ 탐험 휴식의 중요성</strong>
레벨이 끝나고 플레이어를 허브(Hub)로 돌려보낼 때, "자, 이제 자유롭게 탐험해도 돼" 라고 명확한 신호를 줍니다. 새로운 능력을 얻은 직후이므로, 플레이어는 "이 능력으로 아까 못 갔던 곳을 가볼까?" 하는 자발적인 동기가 생깁니다. 복잡한 길 찾기나 스토리 진행의 압박을 주지 않아 온전히 탐험에만 집중하게 배려하는 <strong>메트로이드배니아 스타일</strong>의 탐험 유도 방식입니다.

### 🕸️ 규칙 6 : 허브는 오픈 월드가 아니다 (Hubs are Not Open World)
<strong>&lt;God Of War&gt;</strong>의 ‘아홉의 호수’는 오픈 월드가 아닌 <strong>허브(Hub) 구조</strong>입니다.

![허브 구조](https://duck3d.notion.site/image/attachment%3Adc31c2f3-b1b5-40f0-98ea-3c3df6ddd75b%3Aimage.png?table=block&id=31ffcdf9-9754-8094-a6c0-ee16787e3f0b&spaceId=92715d94-9439-418c-9b51-0971d96b93aa&width=1420&userId=&cache=v2)
<span class="m-study-caption">사진 4. 허브 구조 예시</span>

- <strong>중심 (Center) :</strong> 티르의 신전 같은 중앙 거점.
- <strong>바퀴살 (Spokes) :</strong> 중심에서 뻗어 나가는 통로들.
- <strong>도착지 (Endpoints) :</strong> 각 레벨이나 던전.

플레이어는 중심에서 출발해 바퀴살(통로)을 지나 레벨(도착지)을 클리어하고, 다시 중심으로 돌아옵니다. 돌아올 때는 '새로운 능력'을 가진 상태이므로 허브 곳곳에 숨겨진 비밀을 새로 풀 수 있게 됩니다. 허브는 단순한 이동 공간이 아닌 <strong>레벨과 레벨 사이의 흐름을 연결하고 탐험 욕구를 증폭시키는 장치</strong>입니다.

---

### 🚧 개발 이슈
발표자는 개발 과정에서 발생한 충돌과 해결 과정도 공유합니다.

- <strong>퍼즐의 위치 :</strong> 퍼즐은 3대 핵심 기둥에 포함되진 않았지만, 게임의 흐름을 조절하고 동료와의 협동을 보여주며 전투 기술을 연습시키는 중요한 도구로 기능했습니다.
- <strong>치수 vs 예술 :</strong> 명확한 높이(치수)를 원하는 기획자와 수풀/장식을 넣고 싶은 아티스트 간의 의견 충돌. ➔ <strong>수풀 스타일 가이드</strong>를 만들어 갈 수 있는 곳과 없는 곳을 수풀 배치로 구분하는 타협점을 찾음.
- <strong>후반부의 다양성 :</strong> 게임 후반부에는 새로운 능력을 추가할 예산/시간이 부족함. ➔ 기존 능력들을 섞어서(예: 충격 화살 + 함정) 숙련도를 시험하는 방식으로 다양성 확보.
- <strong>완벽한 원형 허브의 불가능 :</strong> 원래 허브는 완벽한 원형을 의도했으나, 자연스러운 환경을 위해 모양이 찌그러짐. ➔ 대신 <strong>탑(Tower)</strong>을 배치하여 시각적인 랜드마크 역할을 하게 함으로써 구조적 명확성을 확보.

> "제약이 창의성을 만든다."

### 💡 나의 생각
'제약이 창의성을 만든다'라는 말이 매우 흥미롭습니다. <strong>'컷신이 없다'</strong>는 제약은 로딩마저 게임플레이로 승화시켰고, <strong>'점프 버튼이 없다'</strong>는 제약은 오히려 플레이어가 '도끼'라는 도구 하나에 완벽하게 숙달될 수 있게 만들었습니다.

또한, 엄격한 수치와 규격은 겉보기에는 창의성을 해치는 것처럼 보일 수 있지만, 실제로는 플레이어가 길을 잃지 않게 만드는 <strong>‘무의식적 가이드라인’</strong>이 되었습니다. 이 덕분에 UI나 미니맵 없이도 쾌적한 게임이 가능했습니다. 동료(아트레우스) 역시 단순한 짐덩어리가 아닌 핵심 기둥의 일부로 통합시키며 서사와 시스템을 완벽하게 일치시킨 점이 놀랍습니다.
`
}
];