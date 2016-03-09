# vis.js javascript build
# run 'watch -n 1 make'

vis_dir = src

vis_src =	${vis_dir}/namespace.js\
					${vis_dir}/defaults.js\
					${vis_dir}/utils.js\
					${vis_dir}/routers/app-router.js\
					${vis_dir}/collections/app-collection.js\
					${vis_dir}/models/app-model.js\
					${vis_dir}/app.js\
					${vis_dir}/views/app-view.js\
					${vis_dir}/views/profile/households-children-view.js\
					${vis_dir}/views/profile/households-location-view.js\
					${vis_dir}/views/profile/households-poverty-view.js\
					${vis_dir}/views/profile/households-head-view.js\
					${vis_dir}/views/profile/children-gender-view.js\
					${vis_dir}/views/profile/profile-view.js\
					${vis_dir}/views/outcomes/background-view.js\
					${vis_dir}/views/outcomes/coping-mechanisms-view.js\
					${vis_dir}/views/outcomes/context-view.js\
					${vis_dir}/views/outcomes/education-view.js\
					${vis_dir}/views/outcomes/family-conditions-view.js\
					${vis_dir}/views/outcomes/case-studies-view.js\
					${vis_dir}/views/outcomes/further-resources-view.js\
					${vis_dir}/views/outcomes/incomes-view.js\
					${vis_dir}/views/outcomes/expenditures-view.js\
					${vis_dir}/views/outcomes/results-children-view.js\
					${vis_dir}/views/time-line-navigation-view.js\
					${vis_dir}/charts/bar-chart-age.js\
					${vis_dir}/charts/bar-chart-children.js\
					${vis_dir}/charts/bar-chart-location.js\
					${vis_dir}/charts/bar-chart-stacked-households.js\
					${vis_dir}/charts/bar-chart-stacked-children.js\
					${vis_dir}/charts/time-line-navigation.js\
					${vis_dir}/charts/multi-series-time-line.js\
					${vis_dir}/charts/multi-series-time-line-alt.js\
					${vis_dir}/charts/bar-chart-multi-stacked.js\
					${vis_dir}/charts/bar-chart-multi-clustered.js\
					${vis_dir}/charts/heatmap.js\
					${vis_dir}/charts/heatmap-legend.js\
					${vis_dir}/charts/bar-chart-education.js\
					${vis_dir}/charts/map-beneficiaries.js\
					${vis_dir}/charts/context-timeline.js\
					${vis_dir}/templates/app-templates.js\

# vis.js build
vis.js: ${vis_src}
	cat > $@ $^
