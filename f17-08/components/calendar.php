<?xml version="1.0" encoding="utf-8"?>
<!DOCTYPE html>
<html>

	<head>
		<title>Calendar</title>
		<meta content="IE=edge" http-equiv="X-UA-Compatible">
		<meta content="width=device-width, initial-scale=1" name="viewport">
		<link href="calendar.css" rel="stylesheet">
		<style>
			body {
				font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
				color: #333;
				font-size: 1.6rem;
				background-color: #FAFAFA;
				-webkit-font-smoothing: antialiased;
			}

			.container {
				width: 96%;
				margin: 1.6rem auto;
				max-width: 42rem;
				text-align: center;
			}

			.demo-picked {
				font-size: 1.2rem;
				text-align: center;
			}

			.demo-picked span {
				font-weight: bold;
			}
		</style>
	</head>

	<body>
		<div class="container">

			<div id="v-cal">
				<!-- Header to calendar with Left, Month, and Right -->
				<div class="vcal-header">
					<!-- Left -->
					<button class="vcal-btn" data-calendar-toggle="previous">
						<svg height="24" version="1.1" viewbox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
							<path d="M20,11V13H8L13.5,18.5L12.08,19.92L4.16,12L12.08,4.08L13.5,5.5L8,11H20Z"></path>
						</svg>
					</button>

					<!-- Month -->
					<div class="vcal-header__label" data-calendar-label="month">
						March 2017
					</div>

					<!-- Right -->
					<button class="vcal-btn" data-calendar-toggle="next">
						<svg height="24" version="1.1" viewbox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
							<path d="M4,11V13H16L10.5,18.5L11.92,19.92L19.84,12L11.92,4.08L10.5,5.5L16,11H4Z"></path>
						</svg>
					</button>
				</div>

				<!-- Days of the week -->
				<div class="vcal-week">
					<span>Mon</span>
					<span>Tue</span>
					<span>Wed</span>
					<span>Thu</span>
					<span>Fri</span>
					<span>Sat</span>
					<span>Sun</span>
				</div>

				<!-- Days in the month selected -->
				<div class="vcal-body" data-calendar-area="month"></div>
			</div>

		</div>

        <!-- Calendar -->
		<script src="calendar.js" type="text/javascript"></script>
		
		<!-- Days in the month selected -->
		<script>
			window.addEventListener('load', function() {
                calendar.init({});
            })
		</script>
	</body>

</html>