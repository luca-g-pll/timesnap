# TimeSnap - Test Scenarios

## ✅ Test 1: Timer Countdown Accuracy
**Steps:**
1. Set Timer to 00:10:00
2. Click Start
3. Wait 5 seconds
4. Check display shows 00:09:55

**Expected:** Timer counts down precisely, no skipped seconds

**Implementation:**
- Uses `Date.now() - startTimestamp` for precise calculation
- No dependency on setInterval timing accuracy

---

## ✅ Test 2: Chrono Count Up Accuracy
**Steps:**
1. Go to Chrono mode
2. Click Start
3. Wait 5 seconds
4. Check display shows 00:00:05

**Expected:** Chrono counts up precisely, no skipped seconds

**Implementation:**
- Uses `Date.now() - startTimestamp` for precise calculation
- Same precision as Timer

---

## ✅ Test 3: Clock Real Time Display
**Steps:**
1. Go to Clock mode
2. Check time matches system time
3. Wait 1 minute
4. Verify clock is still synchronized

**Expected:** Clock shows accurate system time, updates every second

**Implementation:**
- Uses `new Date()` for real system time
- Separate `clockUpdateInterval` from timer/chrono

---

## ✅ Test 4: Timer Continues in Background
**Steps:**
1. Set Timer to 00:10:00, Start
2. After 3 seconds (Timer shows 00:09:57), switch to Chrono
3. Wait 5 seconds
4. Switch back to Timer

**Expected:** Timer shows 00:09:52 (8 seconds elapsed total)

**Implementation:**
- `timerState.interval` continues running
- Calculates time from `startTimestamp`, not affected by mode changes
- `updateDisplay()` only updates when `mode==='timer'`

---

## ✅ Test 5: Chrono Continues in Background
**Steps:**
1. Go to Chrono, Start
2. After 3 seconds, switch to Timer
3. Wait 5 seconds
4. Switch back to Chrono

**Expected:** Chrono shows 00:00:08 (8 seconds total)

**Implementation:**
- `chronoState.interval` continues running
- Independent from timer
- `updateDisplay()` only updates when `mode==='stopwatch'`

---

## ✅ Test 6: Timer and Chrono Both Active
**Steps:**
1. Set Timer to 00:05:00, Start (Timer counts down)
2. Switch to Chrono, Start (Chrono counts up)
3. Switch to Clock (both continue in background)
4. Wait 10 seconds
5. Switch to Timer

**Expected:** Timer shows 00:04:50

6. Switch to Chrono

**Expected:** Chrono shows 00:00:10

**Implementation:**
- Two independent intervals running
- Each has own `state.interval`
- Each calculates from own `state.startTimestamp`

---

## ✅ Test 7: Timer Expires in Background
**Steps:**
1. Set Timer to 00:00:05, Start
2. Immediately switch to Chrono
3. Wait 6 seconds

**Expected:**
- Alert "Time is up!" appears
- When switching back to Timer, shows 00:00:00
- Chrono is unaffected

**Implementation:**
- Timer interval detects `timeInSeconds <= 0`
- Calls `stop(timerState)` with explicit state
- Does not affect chronoState
- UI buttons only updated if on timer mode

---

## ✅ Test 8: Clock Not Affected by Timer/Chrono
**Steps:**
1. Start Timer
2. Start Chrono (both running)
3. Switch to Clock

**Expected:** Clock shows accurate system time, not affected by timer/chrono values

**Implementation:**
- Clock uses `new Date()`, not state.timeInSeconds
- Separate `updateClockDisplay()` function
- `updateDisplay()` only called when `mode !== 'clock'`

---

## ✅ Test 9: Pause and Resume Precision
**Steps:**
1. Set Timer to 00:10:00, Start
2. After 3 seconds (00:09:57), Pause
3. Wait 5 seconds (paused)
4. Resume
5. After 2 more seconds, should show 00:09:55

**Expected:** No time lost during pause, resumes accurately

**Implementation:**
- Pause saves `pausedTimeRemaining = state.timeInSeconds`
- Resume: `startTimestamp = Date.now() - pausedTimeRemaining * 1000`
- Calculations remain precise

---

## ✅ Test 10: Milliseconds Toggle
**Steps:**
1. Enable "Show Milliseconds"
2. Start Timer
3. Verify format: 00:09:59.347
4. Disable milliseconds
5. Verify format: 00:09:59

**Expected:**
- Milliseconds appear/disappear
- Time remains accurate
- Font size adjusts (smaller with milliseconds)

**Implementation:**
- `showMilliseconds` flag controls format
- Interval changes from 100ms to 10ms when enabled
- CSS class `with-milliseconds` added to display

---

## 🔧 Key Implementation Details

### State Separation
```javascript
timerState = {
  isRunning, isPaused, interval,
  timeInSeconds, startTimestamp, ...
}

chronoState = {
  isRunning, isPaused, interval,
  timeInSeconds, startTimestamp, ...
}
```

### Precise Time Calculation
```javascript
// Always uses real timestamps
const elapsedMs = Date.now() - state.startTimestamp;
const elapsed = Math.floor(elapsedMs / 1000);

// Timer
state.timeInSeconds = state.initialTime - elapsed;

// Chrono
state.timeInSeconds = state.initialTime + elapsed;
```

### Conditional Display Updates
```javascript
// Only update when visible
if(mode === 'timer') updateDisplay(ms);
if(mode === 'stopwatch') updateDisplay(ms);
if(mode === 'clock') updateClockDisplay();
```

### Protected Stop Function
```javascript
function stop(targetState=null){
  const state = targetState || getState();
  // Stop the interval
  state.isRunning = false;
  clearInterval(state.interval);
  
  // Only update UI if this is the current mode
  if(!targetState || state === getState()){
    // Update buttons, display, etc.
  }
}
```

---

## 📊 Test Results Expected

All tests should pass with:
- ✅ No seconds lost or gained
- ✅ Precise timing using timestamps
- ✅ Independent timer/chrono operation
- ✅ Correct clock display
- ✅ No conflicts between modes
- ✅ Clean UI state synchronization
