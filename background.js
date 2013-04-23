// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// This event is fired each time the user updates the text in the omnibox,
// as long as the extension's keyword mode is still active.
chrome.omnibox.onInputChanged.addListener(
  function(text, suggest) {
    suggest([
      {content: "http://slovari.yandex.ru/" + text + "/перевод/#lingvo", description: "Translate <match>" + text + "</match> with Lingvo"},
      {content: "http://yandex.ru/yandsearch?text=" + text, description: "Искать <match>" + text + "</match> в Яндексе"},
      {content: "http://images.yandex.ru/yandsearch?text=" + text, description: "Искать <match>" + text + "</match> в картинках Яндекса"},
      {content: "http://ru.wikipedia.org/wiki/" + text, description: "Искать <match>" + text + "</match> в Википедии"},
      {content: "http://en.wikipedia.org/wiki/" + text, description: "Search <match>" + text + "</match> against Wikipedia"}
    ]);
    defaultSuggestion(text);
  });

function navigate(url) {
  chrome.tabs.getSelected(null, function(tab) {
    chrome.tabs.update(tab.id, {url: url});
  });
}

function defaultSuggestion(text) {
  chrome.omnibox.setDefaultSuggestion(text ? 
    {content: "https://www.google.com/search?q=" + text, description: "Search <match>" + text + "</match> against Google"} :
    {description: 'Search in different engines'}
  );
}

chrome.omnibox.onInputStarted.addListener(
  function() {
    defaultSuggestion();
  });

// This event is fired with the user accepts the input in the omnibox.
chrome.omnibox.onInputEntered.addListener(
  function(text) {
    if ('http' == text.substring(0,4)) {
      navigate(text);
    }
  });
