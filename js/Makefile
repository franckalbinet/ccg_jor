# vis.js javascript build
# run 'watch -n 1 make'

vis_dir = src

vis_src =	${vis_dir}/namespace.js\
					${vis_dir}/defaults.js\
					${vis_dir}/routers/app-router.js\
					${vis_dir}/collections/app-collection.js\
					${vis_dir}/models/app-model.js\
					${vis_dir}/app.js\
					${vis_dir}/views/scenarios-view.js\
					${vis_dir}/views/children-age-view.js\
					${vis_dir}/views/bar-chart-horizontal-view.js\
					${vis_dir}/views/bar-chart-vertical-view.js\
					${vis_dir}/views/households-children-view.js\
					${vis_dir}/views/households-location-view.js\
					${vis_dir}/views/households-poverty-view.js\
					${vis_dir}/views/life-improvement-view.js\
					${vis_dir}/views/covering-needs-view.js\
					${vis_dir}/charts/bar-chart-age.js\
					${vis_dir}/charts/bar-chart-children.js\
					${vis_dir}/charts/bar-chart-location.js\
					${vis_dir}/charts/bar-chart-stacked-single.js\

# vis.js build
vis.js: ${vis_src}
	cat > $@ $^
