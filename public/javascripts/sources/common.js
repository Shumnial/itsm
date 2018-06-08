$(() =>{
	AOS.init({
		duration: 600,
		disable: 'mobile'
	});

	const calcInputs =
	{
		"workers": $('.calc-item__input[data-calc="workers"]'),
		"average-salary": $('.calc-item__input[data-calc="average-salary"]'),
		"ratio": $('.calc-item__input[data-calc="ratio"]'),
		"margin": $('.calc-item__input[data-calc="margin"]'),
		"workdays": $('.calc-item__input[data-calc="workdays"]'),
	}

	const calcResults =
	{
		"workers": $('.calc-item__result[data-calc="workers"]'),
		"average-salary": $('.calc-item__result[data-calc="average-salary"]'),
		"ratio": $('.calc-item__result[data-calc="ratio"]'),
		"margin": $('.calc-item__result[data-calc="margin"]'),
		"workdays": $('.calc-item__result[data-calc="workdays"]'),
	}

	function calcWorkers() {
		return Math.floor(+calcInputs["average-salary"].val() * 1.42);
	}

	function calcAvgSalary() {
		return Math.floor(calcWorkers() * +calcInputs["workers"].val());
	}

	function calcRatio() {
		return Math.floor(calcAvgSalary() / +calcInputs["ratio"].val() * 100);
	}

	function calcMargin() {
		return Math.floor(calcRatio() / +calcInputs["margin"].val() * 100);
	}

	function calcWorkdays() {
		return Math.floor(calcMargin() / +calcInputs["workdays"].val() * 100);
	}

	function getResult(valueName, funcName) {
		const separatedResult = String(funcName).replace(/(\d)(?=(\d{3})+([^\d]|$))/g, '$1 ');
		const setTitle = valueName.attr('title', separatedResult + ' ₽');
		const setResult = valueName.text(separatedResult);
	}

	function onCalcSubmit(evt) {
		evt.preventDefault();
		getResult(calcResults['workers'], calcWorkers());
		getResult(calcResults['average-salary'], calcAvgSalary());
		getResult(calcResults['ratio'], calcRatio());
		getResult(calcResults['margin'], calcMargin());
		getResult(calcResults['workdays'], calcWorkdays());
		$('.calc__row--hidden').removeClass('calc__row--hidden');
		$('.calc__btn').text('Пересчитать');
	}

	const links = $('.main-nav__link');

	let linksWidth = {
		"0": "",
		"1": "",
		"2": "",
		"3": "",
		"4": ""
	}

	for (let i = 0; i < links.length; i++) {
		linksWidth[i] = links.eq(i).outerWidth();
	};

	let previousId = 0;
	let previousWidth = 0;

	

	const navCoords = $('.intro').offset().top;
	function onScroll () {
		const target = $('.main-nav');
		if ($(window).scrollTop() >= navCoords) {
			target.css('position', 'fixed');
			target.css('top', '0');
		} else {
			target.css('position', 'absolute');
			target.css('top', '100%');
		}
	};

	 

	$('.calc__form').on('submit', onCalcSubmit);
	onScroll();
	$(document)
		.on('scroll', onScroll);

	!function() {
		const sections = $('.section[id]');
		const progressEl = $('.main-nav__progress');
		const row = $('.main-nav__row');
		const positions = {};
		const links = $('.main-nav__link');
		const lastTarget = $('.main-nav__link').last().attr('href').slice(1);
		let spyScroll = true;
		let progressWidth = 0;
		let progressMinWidth = 0;


		links.on('click', onLinkClick)

		function onLinkClick(evt) {
			evt.preventDefault();
			const target = $(this);
			const id  = $(this).attr('href');
			const top = $(id).offset().top + 10;
			spyScroll = false;

			$('body, html').animate({scrollTop: top}, 1000, () => {
				spyScroll = true;

				scrollHandler.call(null)
			});

			
		}
		
		function getPositions () {
			progressMinWidth = row.offset().left;
			sections.each((idx, el) => {
				positions[el.id]= $(el).offset().top
			});
		}

		function getComputedWidth (target) {

			if(!target) {
				links.removeClass('is-active');
				return progressMinWidth
			}

			const el = $(`.main-nav__link[href="#${target}"]`);

			if(target === lastTarget) {
				setActive(el);
				return '100%';
			}

			const w = el.outerWidth() || 0;
			const p = el.offset().left || 0;
			const result = p + w;

			setActive(el);
			return result <= 0 ? progressMinWidth : result
		}

		function setActive (el) {
			el.addClass('is-active');
			$(`.main-nav__link:lt(${el.index()})`).addClass('is-active');
			$(`.main-nav__link:gt(${el.index()})`).removeClass('is-active');
		}

		function scrollHandler () {
			if(!spyScroll) return;
			spyScroll = true
			const top = $(window).scrollTop();
			let target = null;
			for (let i in positions) {
				if (positions[i] <= top) {
					target = i;
				}
			}
			const w = getComputedWidth(target);
			progressEl.width(w)
		}

		getPositions();
		scrollHandler();

		$(window)
			.on('resize', $.debounce(100, getPositions))
			.on('scroll', $.debounce(100, scrollHandler))
	}();
})