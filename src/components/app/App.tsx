import * as React from 'react';

import { SparkLineChart } from '../sparklines/SparkLineChart';
import { DataService } from '../../service/';
import './App.scss';

export class App extends React.Component<{}, {}> {
    public render() {
        return (
            <div className="Dashboard">
                <SparkLineChart data={DataService.getData()} />
            </div>
        );
    }
}
