// add business logic to interactive elements

function resize() {
    const reactives = document.querySelectorAll(".react-grid-item");
    reactives.forEach(reactive => {
        reactive.style.width = document.body.clientWidth + "px";
    })
}

window.addEventListener("resize", resize);

window.addEventListener('load', () => {
    resize();
    let activeSlider = null;

    let weight = 0;
    let height = 0;

    const weightDiv = document.getElementById("ref-r1");
    const heightDiv = document.getElementById("ref-r2");

    const weightHandle = weightDiv.querySelector(".rc-slider-handle");
    const heightHandle = heightDiv.querySelector(".rc-slider-handle");

    const weightSlider = weightHandle.parentElement;
    const heightSlider = heightHandle.parentElement;

    update(weightSlider, 35);
    update(heightSlider, 65);

    document.addEventListener("touchmove", drag);
    document.addEventListener("mousemove", drag);

    document.addEventListener("touchend", dragEnd);
    document.addEventListener("mouseup", dragEnd);

    weightSlider.addEventListener("touchstart", dragStart);
    weightSlider.addEventListener("mousedown", dragStart);

    heightSlider.addEventListener("touchstart", dragStart);
    heightSlider.addEventListener("mousedown", dragStart);

    function dragStart(e) {
        activeSlider = e.currentTarget;
        let pos;
        
        if (e.type === "touchstart") {
            pos = e.touches[0].clientX;
        } else {
            pos = e.clientX;
        }

        updateByPos(activeSlider, pos);
    }

    function dragEnd(e) {
        if (activeSlider) {
            activeSlider = null;
        }
    }

    function drag(e) {
        if (activeSlider) {
            e.preventDefault();
            let pos;
        
            if (e.type === "touchmove") {
                pos = e.touches[0].clientX;
            } else {
                pos = e.clientX;
            }

            updateByPos(activeSlider, pos);
        }
    }

    function updateByPos(slider, pos) {
        const sliderWidth = slider.getBoundingClientRect().width;
        const sliderLeft = slider.getBoundingClientRect().left;

        const percentage = (pos - sliderLeft) / sliderWidth * 100;
        update(slider, percentage);
    }

    function update(slider, percentage) {
        percentage = Math.max(0, Math.min(100, percentage));

        const handle = slider.querySelector(".rc-slider-handle");
        handle.style.left = percentage + "%";

        const track = slider.querySelector(".rc-slider-track");
        track.style.width = percentage + "%";

        const dots = slider.querySelectorAll(".rc-slider-dot");
        dots.forEach(dot => {
            const left = parseInt(dot.style.left);
            if (left > percentage) {
                dot.classList.remove("rc-slider-dot-active");
            } else {
                dot.classList.add("rc-slider-dot-active");
            }
        });

        const marks = slider.querySelectorAll(".rc-slider-mark-text");
        marks.forEach(mark => {
            const left = parseInt(mark.style.left);
            if (left > percentage) {
                mark.classList.remove("rc-slider-mark-text-active");
            } else {
                mark.classList.add("rc-slider-mark-text-active");
            }
        });

        if (slider === weightSlider) {
            weight = 25 + percentage;
            const weightValue = weightDiv.querySelector(".rc-slider-value");
            weightValue.textContent = weight.toFixed(0);
        } else {
            height = 100 + percentage;
            const heightValue = heightDiv.querySelector(".rc-slider-value");
            heightValue.textContent = height.toFixed(0);
        }

        updateResult(weight, height);
    }

    function bmi(weight, height) {
        return weight / height / height * 10000;
    }

    function updateResult(weight, height) {
        const result = bmi(weight, height);

        const count = document.querySelector(".gauge-indicator-count");
        count.textContent = result.toFixed(1);

        const indicator = document.querySelector(".gauge-indicator-block");
        const percentage = Math.max(0, Math.min(40, result)) / 40 * 100;
        indicator.style.left = percentage + "%";

        const segments = document.querySelectorAll(".text-segment");
        let activeSegment;
        segments.forEach(segment => {
            const threshold = parseInt(segment.getAttribute("data-value"));
            if (result >= threshold) {
                activeSegment = segment;
            }
            segment.classList.remove("active");
        });
        activeSegment.classList.add("active");
    }
});
