function reloader () {
	var views = chrome.extension.getViews();
	views[0].location.reload();
}

var list = '<ul>';
function traverse(jsonObj) {
	for (var i in jsonObj.children) {
		if (jsonObj.children[i].children) {
			list += '<li>'+jsonObj.children[i].title+'<ul>';
			traverse(jsonObj.children[i]);
			list += '</ul></li>';
		}
		else {
			list += '<li>'+jsonObj.children[i].title+'</li>';
		}
	}
}

chrome.management.onInstalled.addListener(reloader);
chrome.management.onUninstalled.addListener(reloader);
chrome.management.onDisabled.addListener(reloader);
chrome.management.onEnabled.addListener(reloader);

$(document).ready(function() {
	// prevent more than one instance
	var views = chrome.extension.getViews();
	if(views.length > 1) {
		if(views[1] == self) {
			views[0].close();
		} 
		else {
			views[1].close();
		}
	}
	
	// have to wait till panelanimation finished
	var aktiv = window.setInterval(function(){
		if (window.innerWidth != 0) {
			 window.clearInterval(aktiv);
			 // Linux, Win & Mac workaround :-P
			if (window.innerWidth < 230 || window.innerHeight < 300) {
				window.resizeBy((230 - window.innerWidth), (300 - window.innerHeight));
			}
		}
	}, 1000);
	
	// load Apps
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
				sortedApps.push(app);
			}
			
		}
		sortedApps.sort();
		for(var i in sortedApps) {
			var splitter = sortedApps[i].split(',');
			var name = splitter[0].replace(/Google /, '');
			$('#appView').append('<div id="'+splitter[2]+'"><img src="'+splitter[1]+'" /><span>'+name+'</span></div>');
			$('#appView > div:last').click(function() {
				chrome.management.launchApp($(this).attr("id"));
			});
		}
		
	});
	
	// load Topsites
	// chrome://thumb/url don't work!
	// http://code.google.com/p/chromium/issues/detail?id=11854
	if (chrome.topSites) {
		chrome.topSites.get(function(sites) {
			for (var i in sites) {
				$('#topsiteView').append('<a href="'+sites[i].url+'" target="_blank"><img src="chrome://favicon/size/16/'+sites[i].url+'" /><span>'+sites[i].title+'</span></a><br />');
			}
		});
	}
	else {
		$('#topsiteView').append('<p>I\'m sorry but your version of Chrome does not support Topsite api</p>')
	}
	
	// load Bookmarks
	chrome.bookmarks.getTree(function(tree) {
		traverse(tree[0]);
		list += '</ul>';
		$('#bookmarkView').append(list);
	});
	
	// set clicks
	$('#apps').click(function() {
		$('section').hide();
		$('#appView').show();
		$('#topsites').removeClass('selected');
		$('#bookmarks').removeClass('selected');
		$('#apps').addClass('selected');
		
	});

	$('#topsites').click(function() {
		$('section').hide();
		$('#topsiteView').show();
		$('#apps').removeClass('selected');
		$('#bookmarks').removeClass('selected');
		$('#topsites').addClass('selected');
	});
	
	$('#bookmarks').click(function() {
		$('section').hide();
		$('#bookmarkView').show();
		$('#apps').removeClass('selected');
		$('#topsites').removeClass('selected');
		$('#bookmarks').addClass('selected');
	});
});
