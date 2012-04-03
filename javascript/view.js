var list;

function traverse(jsonObj) {
	for (var i in jsonObj.children) {
		if (jsonObj.children[i].children) {
			list += '<div class="folder"><header><img src="/image/folder_closed.png" /><span>'+jsonObj.children[i].title+'</header>';
			traverse(jsonObj.children[i]);
			list += '</div>';
		}
		else {
			list += '<div class="item"><img src="chrome://favicon/size/16/'+jsonObj.children[i].url+'" /><a href="'+jsonObj.children[i].url+'" target="_blank">'+jsonObj.children[i].title+'</a></div>';
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
	// list = '<ul>';
	list = '';
	$('#bookmarkView').empty();
	chrome.bookmarks.getTree(function(tree) {
		traverse(tree[0]);
		// list += '</ul>';
		$('#bookmarkView').append(list);
		$('.folder > header').click(function(event) {
				// console.log($(event.target), $(this));
			if ($(event.target).parent('header').is($(this)) || $(event.target).is($(this))) {
				// console.log('in');
				if ($(this).parent('.folder').css('height') == '28px') {
					$(this).children('img').attr('src','/image/folder_open.png');
					$(this).parent('.folder').css('height', 'auto');
					var folderHeight = $(this).parent('.folder').height();
					$(this).parent('.folder').css('height', '28px');
					$(this).parent('.folder').animate({
						height : folderHeight
					}, 'slow', function () {
						$(this).parent('.folder').css('height', 'auto');
					});
					$(this).addClass('fselect');
					var height = event.clientY - 40;
					$('#bookmarkView').animate({
						scrollTop : '+='+height
					}, 'slow');
				}
				else if ($(event.target).parent('.folder')) {
					// console.log('in2');
					$(this).children('img').eq(0).attr('src','/image/folder_closed.png');
					// $(this).parent('.folder').css('height', '28px');
					$(this).parent('.folder').animate({
						height : '28px'
					}, 'slow');
					$(this).removeClass('fselect');
				}
			}
		});
	});
}