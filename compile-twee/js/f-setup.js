"use strict";

// setup.experimental = true;

setup.page = {};
setup.page.onLeave = {
	_preventing: true,
	tryPrevent: function (ev) {
		if (this._preventing) {
			// Cancel the event
			ev.preventDefault(); // If you prevent default behavior in Mozilla Firefox prompt will always be shown
			// Chrome requires returnValue to be set
			ev.returnValue = 'Aplikace Vyprávíme vás žádá o potvrzení, že ji opravdu chcete KOMPLETNĚ opustit. Údaje, které jste vložili, nemusí být uloženy.';
		}
	},
	disablePreventation: function() {
		this._preventing = false;
	}
};

setup.page.onReady = {
	execute: function(){
		window.addEventListener(
			'beforeunload',
			function(ev) {
				setup.page.onLeave.tryPrevent(ev);
			}
		);
	
		$(document).one(
			':enginerestart',
			function(ev) {
				setup.page.onLeave.disablePreventation();
			}
		);
	}
};

setup.app = {
	_subGameClass: '',
	_subGameClassDefaultVal: 'MM',
	_subGameBreadCrumbs: {
		MM: 'Úvodní menu',
		VS: 'VolnoSnění',
		TT: 'TěloTaj',
		EX: 'Experimenty'
	},
	init: function() {},
	setSubGameFrom: function(passageTitle) {
		let subGameClass = passageTitle[0] + passageTitle[1];
		this._setSubGameClass(subGameClass);
	},
	getSubGameBreadCrumb: function() {
		return this._subGameBreadCrumbs[
			this.getSubGameClass()
			];
	},
	getSubGameClass: function() {
		if (!this._subGameClass) {
			console.log(`
WARNING in the passage "${State.passage}":
You cannot get subGameClass (or appropriate subGameBreadCrumb)
before calling setup.app.setSubGameFrom(passageTitle);
setup.app._subGameClassDefaultVal returned
(instead of correct value)! 
			`);
			return this._subGameClassDefaultVal;
		} else {
			return this._subGameClass;
		}
	},
	_setSubGameClass: function(subGameClass) {
		this._subGameClass = subGameClass;
	},
}



setup.diceTypes = ['Starosvětsky', 'Virtuálně'];
setup.fPStartADefault = 3;
setup.fPStartAGetDesc = function(){
	if(settings.fPStartAmount === 1) {
		return 'osudový kámen';
	} else if((settings.fPStartAmount > 1) && (settings.fPStartAmount < 5)) {
		return 'osudové kameny';
	} else {
		return 'osudových kamenů';
	}
};
setup.fPStartAOnChange = function(){
	if (State.variables.roundCounter === 0){
		State.variables.players.forEach(function(item) {
			item.fp = settings.fPStartAmount;
		});
		$('.fp-start-a-refresh-numb').text(settings.fPStartAmount);
		$('.fp-start-a-refresh-desc').text(setup.fPStartAGetDesc());
	}
};
setup.addPlayer = function(arg) {
	return {name: arg, fp: settings.fPStartAmount};
};
setup.addGameCard = function() {
	return {
		text: '', 
		playerIndex: State.variables.pOrder[0],
		but: false,
		whoElse: []
	};
};
/*
Returns the name of the current active player
(returns it packed by 2nd opening and 3rd closing argument).
If no current player, 1st argument is returned.
*/
setup.whoseTurn = function(ifNo, ifYesBeg, ifYesEnd) {
	ifNo = ifNo || '';
	ifYesBeg = ifYesBeg || '';
	ifYesEnd = ifYesEnd || '';
	var _who = State.variables.players[State.variables.pOrder[0]];
	var _cond =  _who && _who.name;
	var _string = _cond ? ifYesBeg + _who.name + ifYesEnd : ifNo;
	return  _string;
};