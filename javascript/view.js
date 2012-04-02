var list;

function traverse(jsonObj) {
	for (var i in jsonObj.children) {
		if (jsonObj.children[i].children) {
			list += '<li class="folder"><img src="/image/folder_closed.png" /><span>'+jsonObj.children[i].title+'</span><ul>';
			traverse(jsonObj.children[i]);
			list += '</ul></li>';
		}
		else {
			list += '<li class="item"><img src="chrome://favicon/size/16/'+jsonObj.children[i].url+'" /><a href="'+jsonObj.children[i].url+'" target="_blank">'+jsonObj.children[i].title+'</a></li>';
		}
	}
}

function loadApps () {
	$('#appView').empty();
	chrome.management.getAll(function(apps) {
		var sortedApps = new Array();
		for(var i in apps) {
			if(apps[i].isApp && apps[i].enabled && apps[i].name != 'Simple Launcher') {
				var app = apps[i].name+',';
				for(var n in apps[i].icons) {
					if(apps[i].icons[n].size == 128) {
						app = app + apps[i].icons[n].url;
					}
				}
				app = app + ',' + apps[i].id;
				if (apps[i].offlineEnabled) {
					app = app + ',' + 'offline';
				}
				sortedApps.push(app);
			}
		}
		
		// CWS workaround
		sortedApps.push('Web Store,chrome://extension-icon/ahfgeienlihckogmohjhadlkjgocpleb/128/0,ahfgeienlihckogmohjhadlkjgocpleb,undefined');
		sortedApps.sort();
		
		for(var i in sortedApps) {
			var splitter = sortedApps[i].split(',');
			var name = splitter[0].replace(/Google /, '');
			$('#appView').append('<div id="'+splitter[2]+'" class="'+splitter[3]+'"><img src="'+splitter[1]+'" /><span>'+name+'</span></div>');
			$('#appView > div:last').click(function() {
				chrome.management.launchApp($(this).attr("id"));
			});
		}
	});
}

function loadTopsites () {
	// chrome://thumb/url don't work!
	// http://code.google.com/p/chromium/issues/detail?id=11854
	$('#topsiteView').empty();
	chrome.topSites.get(function(sites) {
		for (var i in sites) {
			$('#topsiteView').append('<a href="'+sites[i].url+'" target="_blank"><img src="chrome://favicon/size/16/'+sites[i].url+'" /><span>'+sites[i].title+'</span></a><br />');
		}
	});
}

function loadBookmarks () {
	list = '<ul>';
	$('#bookmarkView').empty();
	chrome.bookmarks.getTree(function(tree) {
		traverse(tree[0]);
		list += '</ul>';
		$('#bookmarkView').append(list);
		$('li').click(function(event) {
			if ($(event.target).parent('li.folder').is($(this))) {
				// console.log($(event.target));
				if ($(this).children('ul').css('display') == 'none') {
					$(this).children('img').attr('src','/image/folder_open.png');
					$(this).children('img').addClass('fselect');
					$(this).children('span').addClass('fselect');
					$(this).children('ul').show();
					// console.log(event.clientY);
					// console.log(event.clientY - 40);
					var height = event.clientY - 40;
					$('#bookmarkView').animate({
						scrollTop : '+='+height
					}, 'slow');
				}
				else if ($(event.target).parent('li.folder')) {
					$(this).children('img').eq(0).attr('src','/image/folder_closed.png');
					$(this).children('img').removeClass('fselect');
					$(this).children('span').removeClass('fselect');
					$(this).children('ul').hide();
				}
			}
		});
	});
}