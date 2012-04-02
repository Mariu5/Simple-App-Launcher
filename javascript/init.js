window.addEventListener('online', function () {
	$('.undefined').removeClass('disabled');
	console.log('on');
}, true);

window.addEventListener('offline', function () {
	$('.undefined').addClass('disabled');
	console.log('off');
}, true);

window.onresize =  function () {
	$('section').css('height', window.innerHeight - 30+'px');
};

function reloader () {
	var views = chrome.extension.getViews();
	views[0].location.reload();
}

// apps events
chrome.management.onInstalled.addListener(loadApps);
chrome.management.onUninstalled.addListener(loadApps);
chrome.management.onDisabled.addListener(loadApps);
chrome.management.onEnabled.addListener(loadApps);

// bookmark events
chrome.bookmarks.onChanged.addListener(loadBookmarks);
chrome.bookmarks.onChildrenReordered.addListener(loadBookmarks);
chrome.bookmarks.onCreated.addListener(loadBookmarks);
chrome.bookmarks.onImportEnded.addListener(loadBookmarks);
chrome.bookmarks.onMoved.addListener(loadBookmarks);
chrome.bookmarks.onRemoved.addListener(loadBookmarks);

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
			$('section').css('height', window.innerHeight - 30+'px');
			if (window.innerWidth < 230 || window.innerHeight < 300) {
				window.resizeBy((230 - window.innerWidth), (300 - window.innerHeight));
			}
		}
	}, 1000);
	
	// load Apps
	$('nav').append('<div id="apps" class="selected">Apps</div>');
	loadApps();
	
	// load Topsites
	if (chrome.topSites) {
		$('nav').append('<div id="topsites">TopSites</div>');
		loadTopsites()
	}
	
	// load Bookmarks
	$('nav').append('<div id="bookmarks">Bookmarks</div>');
	loadBookmarks();
	
	
	// set clicks
	$('#apps').click(function() {
		$('section').hide();
		$('#appView').fadeIn('slow');
		$('#topsites').removeClass('selected');
		$('#bookmarks').removeClass('selected');
		$('#apps').addClass('selected');
	});

	$('#topsites').click(function() {
		$('section').hide();
		$('#topsiteView').fadeIn('slow');
		$('#apps').removeClass('selected');
		$('#bookmarks').removeClass('selected');
		$('#topsites').addClass('selected');
	});
	
	$('#bookmarks').click(function() {
		$('section').hide();
		$('#bookmarkView').fadeIn('slow');
		$('#apps').removeClass('selected');
		$('#topsites').removeClass('selected');
		$('#bookmarks').addClass('selected');
	});
});