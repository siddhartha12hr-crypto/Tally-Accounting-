# Admin Panel Error Testing Guide

## 🎯 Purpose
This guide helps you verify that all error handling and crash prevention features are working correctly.

---

## ✅ Pre-Testing Checklist

### Required
- [ ] Application is running on localhost
- [ ] Admin panel is accessible at `/admin`
- [ ] PIN code is available (Default: 9090)
- [ ] Browser console is open (F12)

---

## 🧪 Test Suite

### Test 1: Access Admin Panel
**Goal:** Verify error boundaries are active

1. Navigate to `/admin`
2. Enter PIN: `9090`
3. Click "Unlock"
4. **Expected:** Admin dashboard loads without errors
5. **Check Console:** No error messages

**Status:** ☐ Pass ☐ Fail

---

### Test 2: Switch Between Tabs
**Goal:** Verify each tab loads without crashing

1. Click "Videos" tab → Should load smoothly
2. Click "Sports" tab → Should load smoothly
3. Click "Movies" tab → Should load smoothly
4. Click "Courses" tab → Should load smoothly
5. Click "Settings" tab → Should load smoothly
6. Click "Dashboard" tab → Should load smoothly

**Expected:** All tabs switch without "page didn't load" error
**Check Console:** No React errors

**Status:** ☐ Pass ☐ Fail

---

### Test 3: Add Course (Validation)
**Goal:** Verify form validation is working

#### Test 3.1: Empty Form Submission
1. Go to "Courses" tab
2. Click "Add Course"
3. Click "Save Course" without filling anything
4. **Expected:** Toast error: "Please enter a course title"

**Status:** ☐ Pass ☐ Fail

#### Test 3.2: Missing Instructor
1. Fill only "Course Title"
2. Click "Save Course"
3. **Expected:** Toast error: "Please enter an instructor name"

**Status:** ☐ Pass ☐ Fail

#### Test 3.3: Missing Category
1. Fill "Course Title" and "Instructor"
2. Leave "Category" empty
3. Click "Save Course"
4. **Expected:** Toast error: "Please select a category"

**Status:** ☐ Pass ☐ Fail

#### Test 3.4: Missing Price (When Not Free)
1. Fill all required fields
2. Leave "Free Course" toggle OFF
3. Leave "Price" empty
4. Click "Save Course"
5. **Expected:** Toast error: "Please enter a price or mark the course as free"

**Status:** ☐ Pass ☐ Fail

---

### Test 4: Add Course Successfully
**Goal:** Verify successful course creation

1. Go to "Courses" tab
2. Click "Add Course"
3. Fill form:
   - **Title:** "Test Course"
   - **Instructor:** "Test Instructor"
   - **Category:** "Tally Prime"
   - **Description:** "This is a test course"
   - **Duration:** "10h"
   - **Lessons:** 25
   - **Rating:** 4.5
   - **Toggle "Free Course"** to ON
4. Click "Save Course"
5. **Expected:** 
   - Green success toast: "Course added successfully!"
   - Modal closes
   - New course appears in the list
   - Course shows "Free" as price

**Status:** ☐ Pass ☐ Fail

---

### Test 5: Add Paid Course
**Goal:** Verify paid course creation

1. Click "Add Course"
2. Fill form:
   - **Title:** "Premium Course"
   - **Instructor:** "Pro Instructor"
   - **Category:** "Accounting"
   - **Description:** "This is a premium course"
   - **Free Course:** OFF (unchecked)
   - **Students:** "1,000"
   - **Price:** "₹2,999"
3. Click "Save Course"
4. **Expected:**
   - Success toast
   - Course appears with price "₹2,999"

**Status:** ☐ Pass ☐ Fail

---

### Test 6: Edit Course
**Goal:** Verify course editing works

1. Find a course in the list
2. Click the edit (pencil) icon
3. Change the title to "Updated Course Name"
4. Click "Save Course"
5. **Expected:**
   - Success toast: "Course updated successfully!"
   - Course title updates in the list

**Status:** ☐ Pass ☐ Fail

---

### Test 7: Delete Course
**Goal:** Verify course deletion works

1. Find a course in the list
2. Click the delete (trash) icon
3. Confirm deletion in the popup
4. **Expected:**
   - Success toast: "Course deleted successfully!"
   - Course removed from the list

**Status:** ☐ Pass ☐ Fail

---

### Test 8: Add Video (Validation)
**Goal:** Verify video form validation

#### Test 8.1: Empty Form
1. Go to "Videos" tab
2. Click "Add Video"
3. Click "Save Video" without filling anything
4. **Expected:** Toast error: "Please enter a video title"

**Status:** ☐ Pass ☐ Fail

#### Test 8.2: Missing URL
1. Fill "Title" and "Category"
2. Leave "Video URL" empty
3. Click "Save Video"
4. **Expected:** Toast error: "Please enter a video URL"

**Status:** ☐ Pass ☐ Fail

---

### Test 9: Add Video Successfully
**Goal:** Verify video creation

1. Go to "Videos" tab
2. Click "Add Video"
3. Fill form:
   - **Title:** "Test Video"
   - **Description:** "Test description"
   - **Category:** "Tally Prime Tutorials"
   - **Duration:** "30m"
   - **URL:** "https://youtube.com/watch?v=test"
   - **Thumbnail:** (leave default)
   - **Toggle "Free Video"** to ON
4. Click "Save Video"
5. **Expected:**
   - Success toast: "Video added successfully!"
   - Video appears in list as "Free"

**Status:** ☐ Pass ☐ Fail

---

### Test 10: Edit Video
**Goal:** Verify video editing

1. Click edit icon on a video
2. Change something (e.g., title)
3. Click "Save Video"
4. **Expected:**
   - Success toast: "Video updated successfully!"
   - Changes reflected in list

**Status:** ☐ Pass ☐ Fail

---

### Test 11: Delete Video
**Goal:** Verify video deletion

1. Click delete icon on a video
2. Confirm deletion
3. **Expected:**
   - Success toast: "Video deleted successfully!"
   - Video removed

**Status:** ☐ Pass ☐ Fail

---

### Test 12: Free/Paid Toggle (Courses)
**Goal:** Verify toggle behavior in course form

1. Click "Add Course"
2. **Toggle "Free Course" ON:**
   - Price field should hide
   - Green indicator shows: "This course will be free for all users"
3. **Toggle "Free Course" OFF:**
   - Price field appears
   - Students field appears
   - No green indicator

**Status:** ☐ Pass ☐ Fail

---

### Test 13: Free/Paid Toggle (Videos)
**Goal:** Verify toggle behavior in video form

1. Click "Add Video"
2. **Toggle "Free Video" ON:**
   - Price field hides
   - Green indicator shows
3. **Toggle "Free Video" OFF:**
   - Price field appears

**Status:** ☐ Pass ☐ Fail

---

### Test 14: Search Functionality
**Goal:** Verify search works without errors

#### Courses Search
1. Go to "Courses" tab
2. Type in search box: "Tally"
3. **Expected:** Only matching courses show

#### Videos Search
1. Go to "Videos" tab
2. Type in search box: "Tutorial"
3. **Expected:** Only matching videos show

**Status:** ☐ Pass ☐ Fail

---

### Test 15: Error Boundary Recovery
**Goal:** Verify error recovery works

If you ever see an error screen:
1. Check if error boundary UI appears with:
   - Alert triangle icon
   - Error message
   - "Try Again" button
   - "Go Home" button
   - "Reload Page" button
2. Click "Try Again"
3. **Expected:** Component re-renders

**Status:** ☐ Pass ☐ Fail

---

### Test 16: Toast Notifications
**Goal:** Verify toasts appear and are readable

1. Perform any successful action (add/edit/delete)
2. **Check:**
   - Toast appears at top-center
   - Message is clear and readable
   - Green background for success
   - Auto-dismisses after a few seconds
   - Multiple toasts stack properly

**Status:** ☐ Pass ☐ Fail

---

### Test 17: Browser Console Check
**Goal:** Verify no errors in console

1. Complete all above tests
2. Check browser console (F12)
3. **Expected:**
   - No React errors
   - No TypeScript errors
   - No undefined errors
   - Only intentional console.log statements (if any)

**Status:** ☐ Pass ☐ Fail

---

### Test 18: Multiple Rapid Actions
**Goal:** Verify system handles rapid actions

1. Rapidly switch between tabs (5-10 times)
2. Rapidly open/close add dialog (5 times)
3. Rapidly edit different items
4. **Expected:**
   - No crashes
   - No duplicate toasts
   - Smooth performance

**Status:** ☐ Pass ☐ Fail

---

### Test 19: Network Failure Simulation
**Goal:** Test error handling with network issues

1. Open browser DevTools (F12)
2. Go to Network tab
3. Set throttling to "Offline"
4. Try to add a course
5. **Expected:**
   - Operation continues (local state only)
   - No crash
   - OR appropriate error handling if API integrated

**Status:** ☐ Pass ☐ Fail

---

### Test 20: Mobile View Testing
**Goal:** Verify responsive design works

1. Open DevTools (F12)
2. Toggle device toolbar (Ctrl+Shift+M)
3. Select "iPhone 12 Pro" or similar
4. Repeat key tests (add/edit/delete)
5. **Expected:**
   - Everything works on mobile
   - Forms are usable
   - Toasts visible

**Status:** ☐ Pass ☐ Fail

---

## 📊 Test Results Summary

Total Tests: 20

- Passed: _____ / 20
- Failed: _____ / 20
- Skipped: _____ / 20

---

## 🐛 Bug Report Template

If any test fails, use this template:

```
**Test Number:** Test X
**Test Name:** [Name]
**Status:** FAILED
**Steps to Reproduce:**
1. 
2. 
3. 

**Expected Result:**
[What should happen]

**Actual Result:**
[What actually happened]

**Console Errors:**
[Copy any error messages]

**Screenshots:**
[If applicable]

**Browser:** Chrome/Firefox/Safari [Version]
**OS:** Windows/Mac/Linux
```

---

## ✅ Success Criteria

All tests should pass with:
- ✅ No "page didn't load" errors
- ✅ No React component errors
- ✅ All validations working
- ✅ All toasts displaying correctly
- ✅ All CRUD operations successful
- ✅ Clean browser console
- ✅ Smooth user experience

---

## 🎉 What to Test Next

Once basic tests pass:
1. Test with real backend API (if integrated)
2. Test with large datasets (100+ courses)
3. Test with slow network (throttling)
4. Test accessibility (screen readers)
5. Test keyboard navigation
6. Performance testing (React DevTools Profiler)

---

## 📝 Notes Section

Use this space for additional observations:

```
[Your notes here]
```

---

**Tester Name:** ________________
**Date:** ________________
**Time Spent:** ________________
**Overall Status:** ☐ All Pass ☐ Some Issues ☐ Major Issues

---

## 🚀 Quick Commands

### Start Testing
```bash
# Make sure app is running
cd tally-horizon-main
npm run dev
# OR
bun run dev
```

### Check Console
- Press F12 (Chrome/Edge)
- Press Cmd+Option+J (Mac Chrome)
- Press Ctrl+Shift+J (Windows Chrome)

### Clear Cache
```
Ctrl+Shift+Delete (Windows)
Cmd+Shift+Delete (Mac)
```

---

**Good luck testing! Report any issues immediately.** 🎯
