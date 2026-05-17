# Manual regression checklist

Use this checklist after each modernization PR.

## Search + results

- [ ] Open app and verify main screen loads without crash.
- [ ] Open search, type partial method name, verify results list updates.
- [ ] Submit search term from keyboard action and open a method.
- [ ] Clear search using the mic/clear button and verify list resets.
- [ ] Try a term with stage suffix (`Minor`, `Major`, numeric stage) and confirm expected matches.

## Method screen tabs

- [ ] Open method from search and verify tabs load (`Line`, `Grid`, `Details`, `Practice` where available).
- [ ] Switch between tabs repeatedly and verify state is stable.
- [ ] Scroll method content and verify header/tab behaviour remains correct.

## Custom method flow

- [ ] Open custom method screen and enter valid notation/stage.
- [ ] Confirm generated method opens correctly in method screen.
- [ ] Enter invalid custom data and verify existing validation/error behaviour.

## Stars/favourites

- [ ] Star a method from method screen and verify it appears in starred list.
- [ ] Unstar the same method and verify it is removed.
- [ ] Star a custom method and verify title persistence behaviour.
- [ ] Restart app and confirm starred items persist.

## Settings

- [ ] Open settings screen and toggle each key option used by method rendering/practice.
- [ ] Return to method screen and verify each setting still affects rendering/behaviour.
- [ ] Restart app and confirm setting persistence.

## Deep links + shortcuts

- [ ] Launch via supported method URL deep link and verify correct method opens.
- [ ] Launch via app shortcut (search/discover/custom) and verify destination.
- [ ] Use back navigation from deep-linked method and confirm expected app flow.

## WebView interactions

- [ ] Verify line view renders and updates after option changes.
- [ ] Verify grid view renders and interactive controls still work.
- [ ] Verify practice view loads, starts, and user interactions still work.
- [ ] Verify custom/discover related web content pages still load and interact correctly.

## About/help/privacy/copyright

- [ ] Open each informational page and verify text/layout rendering.
- [ ] Tap external links and verify expected open behaviour.
