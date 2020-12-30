	// making the scroll up button disappear
	$(window).scroll(function () {
			if ($(window).scrollTop() > 600) {
				$('#back-to-top').fadeIn();
			} else {
				$('#back-to-top').fadeOut();
			}
		});

		// scroll body to 0px on click
		$('#back-to-top').click(function () {
			$('body,html').animate({
				scrollTop: 0
			}, 400);
			return false;
		});

		// scroll body to the music section
		$('#ourmusic-btn').click(function () {
			bark();
			$('body,html').animate({
				scrollTop: 873
			}, 400)
			return false;
		});

		// scroll body to the shows section
		$('#shows-btn').click(function () {
			bark();
			$('body,html').animate({
				scrollTop: 1518
			}, 400)
			return false;
		});

		function bark() {
			var barking = new Audio("sounds/single-dog-bark-2.wav");
			barking.play()
		};
