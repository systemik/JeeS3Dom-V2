(function(tau) {
	var page = document.getElementById("main"),
		selector = document.getElementById("selector"),
		selectorComponent,
		clickBound;

	/**
	 * click event handler for the selector
	 */
	function onClick(event) {
		var target = event.target;
		//console.log(activeItem.getAttribute("data-title"));
		/*
		 * Default indicator class selector is "ui-selector-indicator".
		 * If you want to show custom indicator sample code,
		 * check the 'customIndicator.js' please.
		 */
        console.log(target.getAttribute("data-title"));
        tau.changePage(target.getAttribute("data-title"));

		if (target.classList.contains("ui-selector-indicator")) {
            console.log("Indicator clicked");

            console.log(target);
            // console.log(target.("ui-selector-indicator-text"));
            var target = event.target;
            console.log(target);

            console.log(target.getAttribute("data-title"));
			return;
		}
	}

	/**
	 * pagebeforeshow event handler
	 * Do preparatory works and adds event listeners
	 */
	page.addEventListener("pagebeforeshow", function() {
		clickBound = onClick.bind(null);
		selectorComponent = tau.widget.Selector(selector);
		selector.addEventListener("click", clickBound, false);
	});

	/**
	 * pagebeforehide event handler
	 * Destroys and removes event listeners
	 */
	// page.addEventListener("pagebeforehide", function() {
	// 	selector.removeEventListener("click", clickBound, false);
	// 	selectorComponent.destroy();
	// });
}(window.tau));