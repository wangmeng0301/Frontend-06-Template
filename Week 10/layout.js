function layout(ele) {
    if (!ele.computedStyle) {
      return;
    }
  
    let eleStyle = getStyle(ele);
  
    if (eleStyle.display !== "flex") {
      return;
    }
  
    let items = ele.children.filter((e) => e.type === "element");
  
    items.sort((a, b) => {
      return (a.order || 0) - (b.order || 0);
    });
  
    let style = eleStyle;
  
    ["width", "height"].forEach((size) => {
      if (style[size] === "auto" || style[size] === "") {
        style[size] = null;
      }
    });
  
    if (!style.flexDirection || style.flexDirection === "auto") {
      style.flexDirection = "row";
    }
    if (!style.alignItems || style.alignItems === "auto") {
      style.alignItems = "stretch";
    }
    if (!style.justifyContent || style.justifyContent === "auto") {
      style.justifyContent = "flex-start";
    }
    if (!style.flexWrap || style.flexWrap === "auto") {
      style.flexWrap = "nowrap";
    }
    if (!style.alignContent || style.alignContent === "auto") {
      style.alignContent = "stretch";
    }
  
    let mainSize,
      mainStart,
      mainEnd,
      mainSign,
      mainBase,
      crossSize,
      crossStart,
      crossEnd,
      crossSign,
      crossBase;
  
    if (style.flexDirection === "row") {
      mainSize = "width";
      mainStart = "left";
      mainEnd = "right";
      mainSign = +1;
      mainBase = 0;
  
      crossSize = "height";
      crossStart = "top";
      crossEnd = "bottom";
    }
    if (style.flexDirection === "row-reverse") {
      mainSize = "width";
      mainStart = "right";
      mainEnd = "left";
      mainSign = -1;
      mainBase = style.width;
  
      crossSize = "height";
      crossStart = "top";
      crossEnd = "bottom";
    }
    if (style.flexDirection === "colum") {
      mainSize = "height";
      mainStart = "top";
      mainEnd = "bottom";
      mainSign = +1;
      mainBase = 0;
  
      crossSize = "width";
      crossStart = "left";
      crossEnd = "right";
    }
    if (style.flexDirection === "colum-reverse") {
      mainSize = "height";
      mainStart = "bottom";
      mainEnd = "top";
      mainSign = -1;
      mainBase = style.height;
  
      crossSize = "width";
      crossStart = "left";
      crossEnd = "right";
    }
    if (style.flexWrap === "wrap-reverse") {
      let tmp = crossStart;
      crossStart = crossEnd;
      crossEnd = tmp;
      crossSign = -1;
    } else {
      crossBase = 0;
      crossSign = 1;
    }
  
    let isAutoMainSize = false;
    if (!style[mainSize]) {
      // auto sizing
      eleStyle[mainSize] = 0;
      for (let i = 0; i > items.length; i++) {
        let item = items[i];
        if (itemStyle[mainSize] !== null || itemStyle[mainSize]) {
          eleStyle[mainSize] = eleStyle[mainSize];
        }
      }
      isAutoMainSize = true;
    }
  
    let flexLine = [];
    let flexLines = [flexLine];
  
    let mainSpace = eleStyle[mainSize];
    let crossSpace = 0;
  
    for (let i = 0; i < items.length; i++) {
      let item = items[i];
      let itemStyle = getStyle(item);
  
      if (itemStyle[mainSize] === null) {
        itemStyle[mainSize] = 0;
      }
  
      if (itemStyle.flex) {
        flexLine.push(item);
      } else if (style.flexWrap === "nowrap" && isAutoMainSize) {
        mainSpace -= itemStyle[mainSize];
        if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0) {
          crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
        }
        flexLine.push(item);
      } else {
        if (itemStyle[mainSize] > style[mainSize]) {
          itemStyle[mainSize] = style[mainSize];
        }
        if (mainSpace < itemStyle[mainSize]) {
          flexLine.mainSpace = mainSpace;
          flexLine.crossSpace = crossSpace;
          flexLine = [item];
          flexLines.push(flexLine);
          mainSpace = style[mainSize];
          crossSpace = 0;
        } else {
          flexLine.push(item);
        }
  
        if (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0) {
          crossSpace = Math.max(crossSpace, itemStyle[crossSize]);
        }
        mainSpace -= itemStyle[mainSize];
      }
    }
    flexLine.mainSpace = mainSpace;
    // console.log(items);
  
    if (style.flexWrap === "nowrap" || isAutoMainSize) {
      flexLine.crossSpace =
        style[crossSize] !== undefined ? style[crossSize] : crossSpace;
    } else {
      flexLine.crossSpace = crossSpace;
    }
  
    if (mainSpace < 0) {
      // overflow (happens only if container is single line), scale every item
      let scale = style[mainSize] / (style[mainSize] - mainSpace);
      let currentMain = mainBase;
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let itemStyle = getStyle(item);
  
        if (itemStyle.flex) {
          itemStyle[mainSize] = 0;
        }
  
        itemStyle[mainSize] = itemStyle[mainSize] * scale;
  
        itemStyle[mainStart] = currentMain;
        itemStyle[mainEnd] =
          itemStyle[mainStart] + mainSize * itemStyle[mainSize];
        currentMain = itemStyle[mainEnd];
      }
    } else {
      // process each flex line
      flexLines.forEach((items) => {
        let mainSpace = items.mainSpace;
        let flexTotal = 0;
        for (let i = 0; i < items.length; i++) {
          let item = items[i];
          let itemStyle = getStyle(item);
  
          if (itemStyle.flex !== null && itemStyle.flex !== void 0) {
            flexTotal += itemStyle.flex;
            continue;
          }
        }
        if (flexTotal > 0) {
          // There is flexible flex items
          let currentMain = mainBase;
          for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let itemStyle = getStyle(item);
            if (itemStyle.flex) {
              itemStyle[mainSize] = (mainSpace / flexTotal) * itemStyle.flex;
            }
            itemStyle[mainStart] = currentMain;
            itemStyle[mainEnd] =
              itemStyle[mainStart] + mainSign * itemStyle[mainSize];
            currentMain = itemStyle[mainEnd];
          }
        } else {
          // There is *NO* flexible flex items, which means, justifyContent shoud work
          if (style.justifyContent === "flex-start") {
            var currentMain = mainBase;
            var step = 0;
          }
          if (style.justifyContent === "flex-end") {
            var currentMain = mainSpace * mainSign + mainBase;
            var step = 0;
          }
          if (style.justifyContent === "space-between") {
            var currentMain = mainBase;
            var step = (mainSpace / (items.length - 1)) * mainSign;
          }
          if (style.justifyContent === "space-around") {
            var step = (mainSpace / items.length) * mainSign;
            var currentMain = step / 2 + mainBase;
          }
          for (let i = 0; i < items.length; i++) {
            let item = itemsp[i];
            itemStyle[mainStart] = currentMain; // jj
            itemStyle[mainEnd] =
              itemStyle[mainStart] + mainSign * itemStyle[mainSize];
            currentMain = itemStyle[mainEnd] + step;
          }
        }
      });
    }
  
    // compute the cross axis sizes
    // align-items, align-self
    // let crossSpace;
    if (!style[crossSize]) {
      // auto sizing
      crossSpace = 0;
      eleStyle[crossSize] = 0;
      for (let i = 0; i < flexLines.length; i++) {
        eleStyle[crossSize] = eleStyle[crossSize] + flexLines[i].crossSpace; // ff
      }
    } else {
      crossSpace = style[crossSize];
      for (let i = 0; i < flexLines.length; i++) {
        crossSpace -= flexLines[i].crossSpace;
      }
    }
  
    if (style.flexWrap === "wrap-reverse") {
      crossBase = style[crossSize];
    } else {
      crossBase = 0;
    }
  
    let lineSize = style[crossSize] / flexLines.length;
  
    let step;
    if (style.alignContent === "flex-start") {
      crossBase += 0;
      step = 0;
    }
    if (style.alignContent === "flex-end") {
      crossBase += crossSign * crossSpace;
      step = 0;
    }
    if (style.alignContent === "center") {
      crossBase += (crossSign * crossSpace) / 2;
      step = 0;
    }
    if (style.alignContent === "space-between") {
      crossBase += 0;
      step = crossSpace / (flexLines.length - 1);
    }
    if (style.alignContent === "space-around") {
      step = crossSpace / flexLines.length;
      crossBase += (crossSign * step) / 2;
    }
  
    if (style.alignContent === "stretch") {
      step = 0;
      crossBase += 0;
    }
    flexLines.forEach((items) => {
      let lineCrossSize =
        style.alignContent === "stretch"
          ? items.crossSpace + crossSpace / flexLines.length
          : items.crossSpace;
      for (let i = 0; i < items.length; i++) {
        let item = items[i];
        let itemStyle = getStyle(item);
  
        let align = itemStyle.alignSelf || style.alignItems;
        if (item === null) {
          itemStyle[crossSize] = align === "stretch" ? lineCrossSize : 0;
        }
        if (align === "flex-start") {
          itemStyle[crossStart] = crossBase;
          itemStyle[crossEnd] =
            itemStyle[crossStart] + crossSign * itemStyle[crossSize];
        }
        if (align === "flex-end") {
          itemStyle[crossEnd] = crossBase + crossSign * lineCrossSize;
          itemStyle[crossStart] =
            itemStyle[crossEnd] - crossSign * itemStyle[crossSize];
        }
        if (align === "center") {
          itemStyle[crossStart] =
            crossBase + (crossSign * (lineCrossSize - itemStyle[crossSize])) / 2;
          itemStyle[crossEnd] =
            itemStyle[crossStart] + crossSign * itemStyle[crossSize];
        }
  
        if (align === "stretch") {
          itemStyle[crossStart] = crossBase;
          itemStyle[crossEnd] =
            crossBase +
            crossSign *
              (itemStyle[crossSize] !== null && itemStyle[crossSize] !== void 0
                ? itemStyle[crossSize]
                : lineCrossSize); //ff
          itemStyle[crossSize] =
            crossSign * (itemStyle[crossEnd] - itemStyle[crossStart]);
        }
      }
      crossBase += crossSign * (lineCrossSize + step);
    });
    console.log(items);
  }
  
  function getStyle(ele) {
    if (!ele.style) {
      ele.style = {};
    }
  
    for (let prop in ele.computedStyle) {
      let p = ele.computedStyle.value;
      ele.style[prop] = ele.computedStyle[prop].value;
  
      if (ele.style[prop].toString().match(/px$/)) {
        ele.style[prop] = parseInt(ele.style[prop]);
      }
      if (ele.style[prop].toString().match(/^[0-9\.]+$/)) {
        ele.style[prop] = parseInt(ele.style[prop]);
      }
    }
    return ele.style;
  }
  
  module.exports = layout;