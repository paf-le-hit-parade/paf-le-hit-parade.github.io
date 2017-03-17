$(function() {

				/* CD covers */
	$('.photos').coverflow({
						index:			0,
						density:		2,
						innerOffset:	50,
						innerScale:		.7,
						animateStep:	function(event, cover, offset, isVisible, isMiddle, sin, cos) {
							if (isVisible) {
								if (isMiddle) {
									$(cover).css({
										'filter':			'none',
										'-webkit-filter':	'none'
									});
								} else {
									var brightness	= 1 + Math.abs(sin),
										contrast	= 1 - Math.abs(sin),
										filter		= 'contrast('+contrast+') brightness('+brightness+')';
									$(cover).css({
										'filter':			filter,
										'-webkit-filter':	filter
									});
								}
							}
						},
	
					
					confirm:		function() {
						console.log('Confirm');
					},

					select:			function(event, cover) {
						var img = $(cover).children().andSelf().filter('img').last();
						$('#photos-name').text(img.data('name') || 'unknown').last();
						$('#photos-year').text(img.data('year') || 'unknown').stop(true);
					},
				});	

			
			});