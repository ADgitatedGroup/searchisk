// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

function matchText(text) {
  return "<match>" + text + "</match>";
}

function russianSuggest(text) {
  text_p = text.replace(/\s+/g, "+");
  return [
    {
      content: "http://slovari.yandex.ru/" + text + "/перевод/#lingvo", 
      description: chrome.i18n.getMessage("translate") + " " + matchText(text) + " " + chrome.i18n.getMessage("against") + " " + chrome.i18n.getMessage("lingvo")
    },
    {
      content: "http://yandex.ru/yandsearch?text=" + text, 
      description: chrome.i18n.getMessage("search") + " " + matchText(text) + " " + chrome.i18n.getMessage("against") + " " + chrome.i18n.getMessage("yandex")
    },
    { 
      content: "http://images.yandex.ru/yandsearch?text=" + text, 
      description: chrome.i18n.getMessage("search") + " " + matchText(text) + " " + chrome.i18n.getMessage("against") + " " + chrome.i18n.getMessage("yandex_images")
    },
    {
      content: "http://ru.wikipedia.org/wiki/" + text, 
      description: chrome.i18n.getMessage("search") + " " + matchText(text) + " " + chrome.i18n.getMessage("against") + " " + chrome.i18n.getMessage("russian_wikipedia")
    },
    {
      content: "http://www.youtube.com/results?search_query=" + text_p + "&oq=" + text_p, 
      description: chrome.i18n.getMessage("search") + " " + matchText(text) + " " + chrome.i18n.getMessage("against") + " " + chrome.i18n.getMessage("youtube")
    }
  ]
}

function generalSuggest(text) {
  text_p = text.replace(/\s+/g, "+");
  return [
    {
      content: "https://www.google.com/search?q=" + text, 
      description: chrome.i18n.getMessage("search") + " " + matchText(text) + " " + chrome.i18n.getMessage("against") + " " + chrome.i18n.getMessage("google")
    },
    { 
      content: "http://en.wikipedia.org/wiki/" + text, 
      description: chrome.i18n.getMessage("search") + " " + matchText(text) + " " + chrome.i18n.getMessage("against") + " " + chrome.i18n.getMessage("wikipedia")
    },
    {
      content: "http://slovari.yandex.ru/" + text + "/перевод/#lingvo", 
      description: chrome.i18n.getMessage("translate") + " " + matchText(text) + " " + chrome.i18n.getMessage("against") + " " + chrome.i18n.getMessage("lingvo")
    },
    {
      content: "http://www.bing.com/search?q=" + text, 
      description: chrome.i18n.getMessage("search") + " " + matchText(text) + " " + chrome.i18n.getMessage("against") + " " + chrome.i18n.getMessage("bing")
    },
    {
      content: "http://www.youtube.com/results?search_query=" + text_p + "&oq=" + text_p, 
      description: chrome.i18n.getMessage("search") + " " + matchText(text) + " " + chrome.i18n.getMessage("against") + " " + chrome.i18n.getMessage("youtube")
    }
  ]
}

// This event is fired each time the user updates the text in the omnibox,
// as long as the extension's keyword mode is still active.
chrome.omnibox.onInputChanged.addListener(
  function(text, suggest) {
    if (text.match(/[\u0400-\u04FF\u0500-\u052F]+/g)) {
      suggest(russianSuggest(text));
    } else {
      suggest(generalSuggest(text));
    }
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
    {description: 'Искать в <dim>Яндексе</dim>'}
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
    } else {
      navigate("http://yandex.ru/yandsearch?text=" + text);
    }
  });
