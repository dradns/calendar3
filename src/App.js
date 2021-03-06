import React, {createContext, useContext } from 'react';
import {DateTime, Duration, Info, Interval, Settings} from 'luxon';
import _ from 'lodash';
import {BrowserRouter as Router, Route, Switch} from 'react-router-dom';
import {Grid, Button, Segment} from "semantic-ui-react";
import 'semantic-ui-css/semantic.min.css';


let curDate = DateTime.local();
//////////
//старт///
//////////
const App = () => (
    <Grid columns={1} centered>
      <Grid.Row>
          <Head/>
      </Grid.Row>

      <Grid.Row>
        <Body />
      </Grid.Row>
    </Grid>
);

//////////
//head////
//////////
const Head = () => (
    <Grid celled>
      <Grid.Row >
        <Grid.Column width={4}>
          <CurrentCorner />
        </Grid.Column>

        <Grid.Column width={8}>
          <ButtonPanel />
        </Grid.Column>

        <Grid.Column width={4}>
          <Switcher />
        </Grid.Column>
      </Grid.Row>
    </Grid>
);

/////////
//body///
/////////
const Body = () => (
    <Grid>
      <Grid.Row>
        <Grid.Column width={16}>
          <BodyBar />
        </Grid.Column>
      </Grid.Row>

      <Grid.Row>
        <Grid.Column width={16}>
          <BodyRouterGrid />
        </Grid.Column>
      </Grid.Row>
    </Grid>
);

//////////////////
//currentCorner///
//////////////////
const CurrentCorner = () => (
    <Grid style={{ justifyContent: 'space-evenly'}}>
      <Grid.Column>
        <h1>{curDate.day}</h1>
      </Grid.Column>

      <Grid.Column>
        <h1>{monthName()}</h1>
      </Grid.Column>

      <Grid.Column>
        <h1>{curDate.year}</h1>
      </Grid.Column>
    </Grid>
);

///////////////
//buttonPanel//
///////////////
const ButtonPanel = () => (
    <Button.Group fluid>
      <Button href='/day'>День</Button>
      <Button href='/week'>Неделя</Button>
      <Button href='/month'>Месяц</Button>
      <Button href='/year'>Год</Button>
    </Button.Group>
);

const Dates = () => _.times(curDate.daysInMonth, i => (
    <Grid.Column key={i} >
      <Button basic color='teal' size='mini' fluid style={{marginTop: '10px'}} onClick={createEvent}>
        {dayMonth(i)+ ' day'}
      </Button>
    </Grid.Column>
));

const BodyGridMonth = () => (
    <Grid columns={7} >
      <Grid.Row style={{marginTop: '20px'}}>
        <Dates />
      </Grid.Row>
    </Grid>
);

//////////////
//switcher////
//////////////
const Switcher = () => (
        <Grid style={{ justifyContent: 'space-evenly'}}>
          <Grid.Row>
            <Button icon='angle double left' onClick={() => { alert('hey') }}/>
            <Segment color='grey' content='today'>{}</Segment>
            <Button icon='angle double right' onClick={changeMonth}/>
          </Grid.Row>
        </Grid>
);

////////////////
//bodyBar///////
////////////////

const BodyBar = () => (
    <Grid columns={7}>
      <Grid.Row>
        <Weekdays />
      </Grid.Row>
    </Grid>
);

//////////////////
//BodyRouterGrid//
//////////////////
const BodyRouterGrid = () => (
    <React.Fragment>
      {/*<Route  path={'/day'} component={BodyGridDay} />*/}
      {/*<Route  path={'/week'} component={BodyGridWeek} />*/}
      <Route  path={'/month'} component={BodyGridMonth} />
      {/*<Route  path={'/year'} component={BodyGridYear} />*/}
    </React.Fragment>
);

function monthName() {
    let mas = ['Январь', 'Февраль', 'Март', 'Апрель', 'Май', 'Июнь', 'Июль',
        'Август', 'Сентябрь', 'Октябрь', 'Ноябрь', 'Декабрь'];
    return mas[curDate.month - 1];
}

function dayMonth(i) {
    let mas = [];
    for( let j = 1; j <= curDate.daysInMonth; j++){
        mas.push(j);
    }
    return mas[i];
}

function createEvent(){
    alert('so its a createEvent function');
}

function dayWeek(i) {
    let mas = ['понедельник', 'вторник', 'среда', 'четверг', 'пятница', 'суббота', 'воскресенье'];
    return mas[i];
}

const Weekdays = () => _.times(7, i => (
    <Grid.Column key={i} >
        <Segment color='orange' textAlign='center'>{dayWeek(i)}</Segment>
    </Grid.Column>
));

const changeMonth = () => {
    alert('some');
};

export default App;
