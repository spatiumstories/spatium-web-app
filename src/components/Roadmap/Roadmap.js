import React, { useMemo, useState, useEffect } from 'react';
import RoadmapItemContainer from './RoadmapItemContainer';
import classes from './Roadmap.module.css';
import { data } from '../../data/data';
import RoadmapPicker from './RoadmapPicker';

const Roadmap = () => {
    const [picker, setPicker] = useState("first");

    const changePickerHandler = (change) => {
        setPicker(change);
    };

    useEffect(() => {
        console.log("hello?");
        window.scroll({
            top: document.body.offsetHeight,
            left: 0,
            behavior: 'smooth'
          });
    }, [picker]);
    
    let first = [];
    let second = [];
    let third = [];
    let fourth = [];
    let future = [];

    const allItems = data.map(item => {

        if (item.id <= 5) {
            first.push(
                <RoadmapItemContainer
                    name={item.name}
                    description={item.description}
                    date={item.date}
                    id={item.id}
                    key={item.id}>
                </RoadmapItemContainer>
            );
        } else if (item.id === 6) {
            second.push(
                <RoadmapItemContainer
                    name={item.name}
                    description={item.description}
                    date={item.date}
                    id={item.id}
                    key={item.id}>
                </RoadmapItemContainer>
            );
        } else if (item.id === 7) {
            third.push(
                <RoadmapItemContainer
                    name={item.name}
                    description={item.description}
                    date={item.date}
                    id={item.id}
                    key={item.id}>
                </RoadmapItemContainer>
            );
        } else if (item.id <= 9) {
            fourth.push(
                <RoadmapItemContainer
                    name={item.name}
                    description={item.description}
                    date={item.date}
                    id={item.id}
                    key={item.id}>
                </RoadmapItemContainer>
            );
        } else {
            future.push(
                <RoadmapItemContainer
                    name={item.name}
                    description={item.description}
                    date={item.date}
                    id={item.id}
                    key={item.id}>
                </RoadmapItemContainer>
            );
        }
    });
    const currentSelection = 
        picker === "first" ? first :
        picker === "second" ? second :
        picker === "third" ? third :
        picker === "fourth" ? fourth :
        future;

    return (
        <React.Fragment>
            <RoadmapPicker changePickerHandler={changePickerHandler} selected={picker}/>
            <ul className={classes.list}>
                {currentSelection}
            </ul>
        </React.Fragment>
    );
};

export default Roadmap;