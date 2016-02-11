# vis.js javascript build
# run 'watch -n 1 make'

vis_dir = src

vis_src =	${vis_dir}/namespace.js\
					${vis_dir}/defaults.js\
					${vis_dir}/routers/app-router.js\
					${vis_dir}/collections/app-collection.js\
					${vis_dir}/models/app-model.js\
					${vis_dir}/app.js\
					${vis_dir}/views/app-view.js\
					${vis_dir}/views/navigation-view.js\
					${vis_dir}/views/children-age-view.js\
					${vis_dir}/views/households-children-view.js\
					${vis_dir}/views/households-location-view.js\
					${vis_dir}/views/households-poverty-view.js\
					${vis_dir}/views/households-head-view.js\
					${vis_dir}/views/children-gender-view.js\
					${vis_dir}/views/background-view.js\
					${vis_dir}/views/coping-mechanism-view.js\
					${vis_dir}/views/education-view.js\
					${vis_dir}/views/income-expenditure-view.js\
					${vis_dir}/views/living-condition-view.js\
					${vis_dir}/charts/bar-chart-age.js\
					${vis_dir}/charts/bar-chart-children.js\
					${vis_dir}/charts/bar-chart-location.js\
					${vis_dir}/charts/bar-chart-stacked-households.js\
					${vis_dir}/charts/bar-chart-stacked-children.js\
					${vis_dir}/templates/app-templates.js\

# vis.js build
vis.js: ${vis_src}
	cat > $@ $^
