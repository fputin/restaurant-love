// The part that handles the list searching.

const shortWait = 300;
const medWait = 700;
const longWait = 1000;
const veryLongWait = 4000;

var pos = 0;
var end = 20;

function selectSearchList () {
    return document.querySelectorAll("a[class*='search-snippet-view__link']");
}

function selectListItemAtPos(pos) {
    return selectSearchList()[pos];
}

function selectReview() {
    return document.querySelector("span[class='business-header-rating-view__text _clickable']");
}

function selectBack() {
    return document.querySelector("div[class*='small-search-form-view__icon _type_back']");
}

function scrollToBottomOfSearchList() {
    const nodes = selectSearchList();
    nodes[nodes.length - 1].scrollIntoView();
}

function shouldIScroll(pos) {
    return selectSearchList().length - 1 < pos;
}

function syncsleep(milliseconds) {
    const date = Date.now();
    let currentDate = null;
    do {
        currentDate = Date.now();
    } while (currentDate - date < milliseconds);
}

function run(pos) {
    if (pos >= end) {
        return true; // done
    }

    console.log('loop', pos);

    if (shouldIScroll(pos)) {
        scrollToBottomOfSearchList();
        sleep(longWait).then(() => {
            run(pos);
        });
    } else {
        console.log("selectListItemAtPos");
        selectListItemAtPos(pos).click(); // click list item.
        sleep(longWait).then(() => {
            console.log("selectReview");
            selectReview().click(); // click the reviews.
        }).then(() => {
            sleep(longWait).then(() => {
                console.log("writeReview");
                writeReview();
            }).then(() => {
                sleep(veryLongWait).then(() => {
                    console.log("selectBack");
                    selectBack().click();
                }).then(() => {
                    sleep(longWait).then(() => {
                        console.log('loop', pos, 'done');
                        pos++;
                        run(pos);
                    });
                })
            })
        });
    }
}

run(pos);


// Review writing.
function setNativeValue(element, value) {
    const valueSetter = Object.getOwnPropertyDescriptor(element, 'value').set;
    const prototype = Object.getPrototypeOf(element);
    const prototypeValueSetter = Object.getOwnPropertyDescriptor(prototype, 'value').set;

    if (valueSetter && valueSetter !== prototypeValueSetter) {
        prototypeValueSetter.call(element, value);
    } else {
        valueSetter.call(element, value);
    }
}

function setTextValue(ele, value) {
    ele.value = value;
    ele.dispatchEvent(new Event('change'));
}

function select5thStar() {
    return document.querySelectorAll("div[class*='business-rating-edit-view']")[5];
}

function selectTextArea() {
    return document.querySelector("textarea[class='textarea__control']");
}

function selectSubmitBtn() {
    const submitBtn = [...document.querySelectorAll("button[class*='button']")].filter(ele => ele.innerText === 'Submit');
    return submitBtn.length ? submitBtn[0] : document.querySelectorAll("button[class*='button']")[20];
}

function selectOkBtn() {
    const submitBtn = [...document.querySelectorAll("button[class*='button']")].filter(ele => ele.innerText === 'OK');
    return submitBtn.length ? submitBtn[0] : document.querySelectorAll("button[class*='button']")[20];
}

// sleep time expects milliseconds
function sleep(time) {
    return new Promise((resolve) => setTimeout(resolve, time));
}

function canReview() {
    return Boolean(document.querySelectorAll("div[class*='business-rating-edit-view']").length);
}

function writeReview() {
    if (canReview()) {
        console.log('select5thStar', document.querySelectorAll("div[class*='business-rating-edit-view']").length);
        select5thStar().click();
        sleep(longWait).then(() => {
            console.log('setNativeValue');
            const txtArea = selectTextArea();
            setNativeValue(txtArea, yourMsgHere);
            txtArea.dispatchEvent(new Event('input', { bubbles: true }));
            console.log('event dispatched.')
        }).then(() => {
            sleep(longWait).then(() => {
                console.log('selectSubmitBtn');
                selectSubmitBtn().click();
            }).then(() => {
                sleep(longWait).then(() => {
                    console.log('selectOkBtn');
                    selectOkBtn().click();
                })
            })
        });
    }
}

var yourMsgHere =`Было хорошо! Однако, Путин испортил нам настроение, вторгшись в Украину. Восстаньте  против своего диктатора, прекратите убивать невинных людей! Ваше правительство лжет вам. Восстаньте!`;
