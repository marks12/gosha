function Size(config) {

    let width = config && config.width ? config.width : 100;
    let height = config && config.height ? config.height : 100;

    this.GetWidth = () => {return width};
    this.SetWidth = (w) => {width = w; return this;};

    this.GetHeight = () => {return height};
    this.SetHeight = (h) => {height = h; return this;};

    this.SetSize = (w, h) => {this.SetWidth(w); this.SetHeight(h); return this;};

}

export default Size;