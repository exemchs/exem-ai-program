# Linux / WSL 환경 Claude Code 설치 가이드 추가 제안서

> **작성일**: 2026-03-09
> **요청자**: 김동훈 차장 (exemONE 엔지니어)
> **작성**: CX그룹

---

## 1. 배경

김동훈 차장님 피드백 요약:
- 리눅스에서 사용하는 경우 가이드 필요
- 커서나 다른 툴이 없을 때, 윈도우에 WSL을 설치해서 사용하는 경우 추가 필요
- 엔지니어들에게 익숙한 플랫폼이고, 리눅스 사용법이 추가되면 자연스럽게 WSL로 이어진다

**핵심 인사이트**: EXEM 엔지니어들은 Linux 서버 환경에서 일상 업무를 수행하므로, macOS/Windows(Cursor 기반) 가이드만으로는 실제 업무 환경을 커버하지 못한다.

---

## 2. 리서치 결과 요약

### 2-1. Linux에서 Claude Code 설치

#### 시스템 요구사항

| 항목 | 요구사항 |
|------|----------|
| OS | Ubuntu 20.04+, Debian 10+, Alpine 3.19+ |
| RAM | 4GB 이상 |
| 네트워크 | 인터넷 연결 필수 |
| Shell | Bash, Zsh |

> **참고**: Node.js는 네이티브 설치 시 불필요. npm 설치(deprecated) 시에만 Node.js 18+ 필요.

#### 설치 방법 (네이티브 인스톨러 — 공식 권장)

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

- 설치 경로: `~/.local/bin/claude`
- Node.js 별도 설치 불필요
- 자동 업데이트 내장
- npm 설치는 **deprecated** (더 이상 권장하지 않음)

#### 설치 후 PATH 설정 (필요 시)

```bash
# Bash
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc

# Zsh
echo 'export PATH="$HOME/.local/bin:$PATH"' >> ~/.zshrc
source ~/.zshrc
```

#### 설치 검증

```bash
claude --version    # 버전 확인
claude doctor       # 전체 진단 (의존성, 설정 점검)
```

#### Linux 주요 트러블슈팅

| 증상 | 원인 | 해결 |
|------|------|------|
| `command not found: claude` | PATH 미설정 | `~/.local/bin`을 PATH에 추가 |
| 설치 중 `Killed` | RAM 부족 (4GB 미만) | swap 파일 추가 (`sudo fallocate -l 2G /swapfile`) |
| TLS/SSL 에러 | 인증서 미설치 | `sudo apt-get install ca-certificates` |
| 검색 미작동 | ripgrep 누락 | `sudo apt install ripgrep` |
| 기업 프록시 환경 | HTTPS 프록시 | `HTTPS_PROXY` 환경변수 설정 |
| 기업 인증서 | 사내 CA 인증서 | `NODE_EXTRA_CA_CERTS=/path/to/cert.pem` |

**출처**: [Claude Code 공식 Setup 문서](https://code.claude.com/docs/en/setup), [Claude Code Troubleshooting](https://code.claude.com/docs/en/troubleshooting)

---

### 2-2. Windows WSL에서 Claude Code 설치

#### Step 1: WSL 설치

PowerShell(관리자 모드)에서:
```powershell
wsl --install
```

- WSL2 + Ubuntu가 기본 설치됨
- PC 재시작 필요
- Windows 10 빌드 19041 이상 또는 Windows 11 필요
- BIOS에서 가상화(Intel VT-x / AMD-V) 활성화 필요

#### Step 2: Ubuntu 초기 설정

재시작 후 Ubuntu 터미널이 자동 열림. 사용자명/비밀번호 설정 후:
```bash
sudo apt update && sudo apt upgrade -y
```

#### Step 3: Claude Code 설치

```bash
curl -fsSL https://claude.ai/install.sh | bash
```

#### Step 4: 인증

```bash
claude
```
브라우저 인증 창이 열리면 로그인. WSL에서 브라우저가 안 열리면:
```bash
# 방법 1: Windows 브라우저 경로 지정
export BROWSER="/mnt/c/Program Files/Google/Chrome/Application/chrome.exe"
claude

# 방법 2: 터미널에 표시되는 URL을 직접 복사하여 Windows 브라우저에서 열기
```

#### WSL 핵심 주의사항

**파일시스템 성능 (가장 중요)**:
- 프로젝트 파일은 **반드시 Linux 파일시스템**(`~/projects/`)에 저장
- `/mnt/c/` (Windows 디렉토리)는 약 **9배 느림** → 빌드 속도 저하, 검색 결과 누락
- WSL2 기준 bare-metal Linux 대비 약 87% 성능

**PATH 충돌**:
- Windows에도 Node.js가 설치되어 있으면, WSL에서 Windows 버전을 사용할 수 있음
- `which node`, `which npm`으로 Linux 경로(`/home/...`)를 가리키는지 확인

**샌드박싱**:
- WSL2에서만 지원 (WSL1은 불가)
- 필요 패키지: `sudo apt-get install bubblewrap socat`

**VS Code 연동**:
- Windows에 VS Code 설치 → **Remote - WSL** 확장 설치
- WSL 터미널에서 `code .`로 열면 Linux 환경에서 동작

**리소스 제한** (`%USERPROFILE%\.wslconfig`):
```ini
[wsl2]
memory=6GB
processors=4
swap=2GB
```

#### WSL 주요 트러블슈팅

| 증상 | 해결 |
|------|------|
| 브라우저 로그인 안 열림 | `BROWSER` 환경변수 설정 또는 URL 수동 복사 |
| `node: not found` | nvm으로 Linux Node.js 설치, `which node` 확인 |
| OS 감지 오류 | `npm config set os linux` (npm 설치 시) |
| WSL1 샌드박싱 불가 | `wsl --set-version Ubuntu 2`로 WSL2 전환 |
| 0.0%에서 설치 멈춤 | `wsl --install --web-download -d Ubuntu` |

**출처**: [Microsoft WSL 공식 문서](https://learn.microsoft.com/en-us/windows/wsl/install), [Claude Code WSL 가이드](https://code.claude.com/docs/en/troubleshooting)

---

## 3. EXEM 엔지니어를 위한 예시 프로그램 제안

### 3-1. 왜 예시 프로그램이 필요한가

현재 랜딩페이지의 WhatWeLearnSection에는 파일 처리, Notion 연동, Figma 디자인 변경 등 **CX그룹(비전공자)** 관점의 예시가 있다. 엔지니어에게는 실제 업무와 연결되는 시나리오가 필요하다.

### 3-2. 제안 예시 시나리오 (5개)

#### 예시 1: Oracle Alert 로그 분석 자동화
```
프롬프트: "이 Oracle alert 로그에서 ORA-에러만 추출해서
시간순으로 정리하고, 발생 빈도 Top 10을 보여줘"
```
- **대상**: MaxGauge 엔지니어, DBA
- **포인트**: 수작업으로 grep/awk 조합하던 로그 분석을 자연어로 즉시 실행
- **결과물**: 에러 코드별 발생 빈도 테이블 + 시간대별 추이

#### 예시 2: 서버 디스크/메모리 모니터링 스크립트 생성
```
프롬프트: "서버 10대의 디스크 사용량과 메모리 사용률을
SSH로 일괄 조회해서 CSV로 저장하는 bash 스크립트 만들어줘.
80% 초과 시 경고 표시도 추가해줘"
```
- **대상**: 인프라 엔지니어, exemONE 운영
- **포인트**: 반복적인 모니터링 스크립트를 빠르게 생성하고 바로 테스트

#### 예시 3: Slow Query 분석 및 인덱스 추천
```
프롬프트: "PostgreSQL slow query 로그를 분석해서
실행 시간 상위 10개 쿼리를 뽑고,
각각에 대한 인덱스 추천을 해줘"
```
- **대상**: MaxGauge 엔지니어, DBA
- **포인트**: 쿼리 튜닝 전문성과 Claude Code의 코드 실행 능력 결합

#### 예시 4: Prometheus Alert Rule 설정 자동화
```
프롬프트: "이 Prometheus alerting rules YAML에
CPU 사용률 90% 초과 5분 지속 시 알림 조건을 추가해줘.
Slack webhook으로 알림 보내는 설정도 같이 만들어줘"
```
- **대상**: DevOps, exemONE 운영
- **포인트**: 설정 파일 문법 오류 없이 정확한 위치에 설정 추가

#### 예시 5: Java 에이전트 코드 디버깅
```
프롬프트: "이 Java 에이전트 코드에서 메모리 누수가
의심되는 부분을 찾아서 원인 분석하고 수정안을 제시해줘"
```
- **대상**: InterMax/exemONE 개발자
- **포인트**: 코드 리뷰 + 디버깅을 CLI에서 바로 수행

### 3-3. 예시 프로그램 구성 방향

| 구분 | 내용 |
|------|------|
| **형태** | 라이브 데모 or 터미널 애니메이션 (현재 WhatWeLearn 섹션과 동일 형식) |
| **환경** | Linux 터미널 기반 (bash prompt) |
| **시나리오** | 위 5개 중 2-3개 선택하여 구성 |
| **수준** | 엔지니어가 "이거 나한테 필요한데" 하고 느낄 수 있는 현실적 예시 |

---

## 4. 김동훈 차장님께 드릴 질문 리스트

프로그램을 정확하게 구성하기 위해 확인이 필요한 사항:

### 업무 환경 관련
1. 엔지니어분들이 주로 사용하는 Linux 배포판이 뭔가요? (Ubuntu, CentOS, RHEL 등)
2. 사내 서버에 인터넷 접근이 가능한가요? (프록시, 방화벽 제한 여부)
3. 사내 인증서(CA certificate)를 별도로 사용하나요?
4. 개발/운영 서버의 평균 RAM은 어느 정도인가요? (4GB 미만 서버가 있는지)
5. SSH 접속으로 원격 서버에서 작업하는 비율이 어느 정도인가요?

### 도구/워크플로우 관련
6. 현재 코드 에디터는 뭘 쓰시나요? (vim, VS Code SSH, JetBrains 원격 등)
7. 윈도우 데스크톱에서 WSL을 이미 사용하는 분이 있나요?
8. 엔지니어분들이 가장 많이 작성하는 스크립트 종류는? (bash, python, SQL 등)
9. Git 사용 빈도는 어떤가요? (버전 관리 도구 사용 여부)
10. CI/CD 파이프라인을 직접 관리하나요? (Jenkins, GitHub Actions 등)

### 보안 & 정책 관련
11. 보안 정책상 사내 코드를 외부 AI(클라우드)에 보내는 것에 제한이 있나요?
12. 사내 네트워크에서 외부 API 호출 시 별도 승인 프로세스가 있나요?

---

## 5. 랜딩페이지 반영 방안 (초안)

### 방안 A: 기존 페이지에 OS 탭 확장
현재 Prerequisites 섹션의 macOS/Windows 토글에 **Linux** 탭 추가.
- 장점: 기존 구조 유지, 최소 변경
- 단점: WSL 가이드를 넣기에 공간 부족

### 방안 B: 별도 "Linux / WSL 가이드" 섹션 추가
Prerequisites 섹션 하단에 독립 섹션으로 추가.
- 장점: 충분한 공간 확보, 엔지니어 특화 예시 포함 가능
- 단점: 페이지 길이 증가

### 방안 C: 별도 서브페이지 (권장)
`/linux-guide` 경로로 별도 페이지 구성.
- 장점: 엔지니어 맞춤 콘텐츠 + 예시 프로그램 + 트러블슈팅 모두 수용
- 단점: 추가 개발 필요

**권장**: 방안 A + C 조합 — 기존 페이지에 Linux 탭 추가(간단 안내) + 상세 가이드는 서브페이지

---

## 6. 정보 출처

| 주제 | 출처 |
|------|------|
| Claude Code 설치 | [code.claude.com/docs/en/setup](https://code.claude.com/docs/en/setup) |
| Claude Code 트러블슈팅 | [code.claude.com/docs/en/troubleshooting](https://code.claude.com/docs/en/troubleshooting) |
| WSL 설치 | [learn.microsoft.com/windows/wsl/install](https://learn.microsoft.com/en-us/windows/wsl/install) |
| WSL Node.js 설정 | [learn.microsoft.com/windows/dev-environment/javascript/nodejs-on-wsl](https://learn.microsoft.com/en-us/windows/dev-environment/javascript/nodejs-on-wsl) |
| WSL 개발 환경 | [learn.microsoft.com/windows/wsl/setup/environment](https://learn.microsoft.com/en-us/windows/wsl/setup/environment) |
| Claude Code GitHub | [github.com/anthropics/claude-code](https://github.com/anthropics/claude-code) |
| WSL Claude Code 가이드 | [Medium - Comprehensive Guide](https://medium.com/ai-insights-cobet/comprehensive-guide-to-setting-up-claude-code-on-windows-using-wsl-d3a3f3b5a128) |
| WSL2 성능 최적화 | [Tributary AI - Optimizing WSL2](https://www.thetributary.ai/blog/optimizing-wsl2-claude-code-performance-guide/) |
| Ubuntu Linux 설치 | [LinuxCapable](https://linuxcapable.com/how-to-install-claude-code-on-ubuntu-linux/) |
| DevOps 활용 사례 | [macropage - Claude Code DevOps](https://macropage.medium.com/claude-code-a-surprising-devops-assistant-for-server-management-tasks-0acb86637545) |
