class Panel
{
	constructor(name, foreground, background, msRefresh, refreshCallback)
	{
		this.name = name;
		this.foreground = foreground;
		this.background = background;
		this.msRefresh = msRefresh;
		this.refreshCallback = refreshCallback;
		this.data = [];
		this._min = Infinity;
		this._max = 0;
		this.lastTime = 0;
		this.pixelRatio = Math.round(devicePixelRatio || 1);
		this.width = 100 * this.pixelRatio;
		this.height = 60 * this.pixelRatio;
		this.text = {
			position: {
				x: 3 * this.pixelRatio,
				y: 2 * this.pixelRatio
			}
		};
		this.graph = {
			position: {
				x: 3 * this.pixelRatio,
				y: 18 * this.pixelRatio
			},
			size: {
				width: 94 * this.pixelRatio,
				height: 40 * this.pixelRatio
			}
		};
		this.canvas = document.createElement("canvas");
		this.canvas.width = this.width;
		this.canvas.height = this.height;
		this.canvas.style.width = "100px";
		this.canvas.style.height = "60px";
		this.canvas.style.borderRadius = "5px";
		this.context = this.canvas.getContext("2d");
		this.init();
		this.dom = this.canvas;
	}

	get min()
	{
		return this._min;
	}

	get max()
	{
		return this._max;
	}

	init()
	{
		if (!this.context)
		{
			return;
		}

		const fontSize = 12 * this.pixelRatio;
		this.context.font = `400 ${fontSize}px "Avenir Next", Helvetica, "Helvetica Neue", Arial, sans-serif`;
		this.context.textBaseline = "top";
		this.context.fillStyle = this.background;
		this.context.fillRect(0, 0, this.width, this.height);
		this.context.fillStyle = this.foreground;
		this.context.fillText(this.name, this.text.position.x, this.text.position.y);
	}

	update(time)
	{
		const delta = time - this.lastTime;

		if (delta < this.msRefresh)
		{
			return;
		}

		const args = this.refreshCallback(time, delta);

		if (!args)
		{
			return;
		}

		this.lastTime = time;
		const {
			value,
			maxValue
		} = args;
		this._min = Math.min(this._min, value);
		this._max = Math.max(this._max, value);
		this.data.push(value);
		const realMax = Math.max(this._max, maxValue);

		if (this.data.length > this.graph.size.width)
		{
			this.data.splice(0, this.data.length - this.graph.size.width);
		}

		if (!this.context)
		{
			return;
		}

		this.context.fillStyle = this.background;
		this.context.globalAlpha = 1;
		this.context.fillRect(0, 0, this.width, this.height);
		this.context.fillStyle = this.foreground;
		this.context.fillText(`${Math.round(value)} ${this.name} (${Math.round(this._min)}-${Math.round(this._max)})`, this.text.position.x, this.text.position.y);
		this.context.beginPath();
		this.context.moveTo(this.data.length + this.graph.position.x, (1 - this.data[this.data.length - 1] / realMax) * this.graph.size.height + this.graph.position.y);

		for (let i = this.data.length - 1; i > 0; i--)
		{
			const cpx = i - 1 / 2 + this.graph.position.x;

			const cpy = v => (1 - v / realMax) * this.graph.size.height + this.graph.position.y;

			const cp1y = cpy(this.data[i]);
			const cp2y = cpy(this.data[i - 1]);
			this.context.bezierCurveTo(cpx, cp1y, cpx, cp2y, i - 1 + this.graph.position.x, cp2y);
		}

		this.context.strokeStyle = this.foreground;
		this.context.stroke();
	}

}
// CONCATENATED MODULE: ./dist/esm/Stats.js
;
class Stats
{
	constructor()
	{
		this.mode = 0;
		this.dom = document.createElement("div");
		this.panels = [];
		this.background = "#ffffff";
		this.initStyle();
		this.dom.addEventListener("click", event =>
		{
			event.preventDefault();
			this.showPanel(++this.mode % this.dom.children.length);
		}, false);
		this.beginTime = (performance || Date).now();
		this.frames = 0;
		this.panels.push(this.addPanel("FPS", "#4080f0", 100, (time, delta) =>
		{
			const res = {
				value: this.frames * 1000 / delta,
				maxValue: 100
			};
			this.frames = 0;
			return res;
		}));
		this.panels.push(this.addPanel("MS", "#33A033", 0, time =>
		{
			return {
				value: time - this.beginTime,
				maxValue: 200
			};
		}));

		if (performance && performance.memory)
		{
			this.panels.push(this.addPanel("MB", "#ff0088", 100, () =>
			{
				if (!performance || !performance.memory)
				{
					return;
				}

				const memory = performance.memory;
				const memoryFactor = 1048576;
				return {
					value: memory.usedJSHeapSize / memoryFactor,
					maxValue: memory.jsHeapSizeLimit / memoryFactor
				};
			}));
		}

		this.showPanel(0);
	}

	addPanel(name, foreground, msRefresh, refreshCallback)
	{
		const panel = new Panel(name, foreground, this.background, msRefresh, refreshCallback);
		this.addPanelObject(panel);
		return panel;
	}

	showPanel(id)
	{
		for (let i = 0; i < this.dom.children.length; i++)
		{
			const style = this.dom.children[i].style;

			if (style)
			{
				style.display = i === id ? "block" : "none";
			}
		}

		this.mode = id;
	}

	begin()
	{
		this.beginTime = (performance || Date).now();
	}

	end()
	{
		const time = (performance || Date).now();
		this.frames++;

		for (const panel of this.panels)
		{
			panel.update(time);
		}

		return time;
	}

	update()
	{
		this.beginTime = this.end();
	}

	addPanelObject(panel)
	{
		this.panels.push(panel);
		this.dom.appendChild(panel.dom);
	}

	initStyle()
	{
		const darkMode = typeof matchMedia !== "undefined" ? matchMedia("(prefers-color-scheme: dark)") : undefined;

		const listener = () =>
		{
			this.updateStyle();
		};

		if (darkMode === null || darkMode === void 0 ? void 0 : darkMode.addEventListener)
		{
			darkMode === null || darkMode === void 0 ? void 0 : darkMode.addEventListener("change", listener);
		} else if (darkMode === null || darkMode === void 0 ? void 0 : darkMode.addListener)
		{
			darkMode === null || darkMode === void 0 ? void 0 : darkMode.addListener(listener);
		}

		this.updateStyle();
	}

	updateStyle()
	{
		var _a;

		const darkMode = typeof matchMedia !== "undefined" ? matchMedia("(prefers-color-scheme: dark)") : undefined;
		const darkModeMatch = (_a = darkMode === null || darkMode === void 0 ? void 0 : darkMode.matches) !== null && _a !== void 0 ? _a : false;
		this.dom.style.position = "fixed";
		this.dom.style.top = "5px";
		this.dom.style.left = "5px";
		this.dom.style.cursor = "pointer";
		this.dom.style.opacity = "0.9";
		this.dom.style.zIndex = "10000";
		this.dom.style.borderRadius = "5px";

		if (darkModeMatch)
		{
			this.background = "#000000";
			this.dom.style.boxShadow = "-4px -4px 10px 0 rgb(255, 255, 255, 0.7)";
		} else
		{
			this.background = "#ffffff";
			this.dom.style.boxShadow = "-4px -4px 10px 0 rgb(0, 0, 0, 0.7)";
		}

		for (const panel of this.panels)
		{
			panel.background = this.background;
		}
	}

}