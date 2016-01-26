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
					${vis_dir}/views/children-gender-view.js\
					${vis_dir}/views/households-head-view.js\
					${vis_dir}/views/life-improvement-view.js\

# vis.js build
vis.js: ${vis_src}
	cat > $@ $^
