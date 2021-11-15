import React, {useState} from 'react';
import {IDataset} from "app/shared/model/dataset.model";
import {Dropdown, Label, Segment, Statistic} from "semantic-ui-react";
import {IRectStats} from "app/shared/model/rect-stats.model";
import {IDedupStats} from "app/shared/model/rect-dedup-stats.model";
import './visualizer.scss';

export interface IStatsPanelProps {
  dataset: IDataset,
  rectStats: IRectStats,
  dedupStats: IDedupStats,
}


export const StatsPanel = (props: IStatsPanelProps) => {
  const {dataset, rectStats, dedupStats} = props;
  const [selectedMeasure, setSelectedMeasure] = useState(0);

  const formatStat = (stat) => stat !== null ? stat.toFixed(2) : 'N/A';
  const formatStatPercent = (stat) => stat !== null ? (parseFloat(stat) * 100).toFixed(3) + ' %' : 'N/A';
  let percentOfDups = 0;
  if(dedupStats !== null)
    percentOfDups = dedupStats.percentOfDups;

  return <Segment id='stats-panel' textAlign='left' raised padded>
    <Label attached='top' size='large'>Statistics for <i>{rectStats.count}</i> objects</Label>
    {percentOfDups !== 0 && <Statistic.Group widths='one' className='field-stats'>
      <Statistic className='dedup-stats'> 
          <Statistic.Value>{formatStatPercent(percentOfDups)}</Statistic.Value>
          <Statistic.Label>Duplicates</Statistic.Label>
      </Statistic>
     </Statistic.Group>}
    <h5>Statistics for field: <Label><Dropdown
      options={[{text: dataset.headers[dataset.measure0], value: 0}, {
        text: dataset.headers[dataset.measure1],
        value: 1
      }]}
      inline
      value={selectedMeasure}
      onChange={(event, data) => setSelectedMeasure(data.value as number)}/></Label>
    </h5>
    <Statistic.Group widths='five' className='field-stats'>
      <Statistic>
        <Statistic.Value>{formatStat(rectStats['min' + selectedMeasure])}</Statistic.Value>
        <Statistic.Label>Min</Statistic.Label>
      </Statistic>
      <Statistic>
        <Statistic.Value>{formatStat(rectStats['max' + selectedMeasure])}</Statistic.Value>
        <Statistic.Label>Max</Statistic.Label>
      </Statistic>
      <Statistic>
        <Statistic.Value>{formatStat(rectStats['mean' + selectedMeasure])}</Statistic.Value>
        <Statistic.Label>Mean</Statistic.Label>
      </Statistic>
      <Statistic>
        <Statistic.Value>{formatStat(rectStats['standardDeviation' + selectedMeasure])}</Statistic.Value>
        <Statistic.Label>SD</Statistic.Label>
      </Statistic>
      <Statistic>
        <Statistic.Value>{formatStat(rectStats['variance' + selectedMeasure])}</Statistic.Value>
        <Statistic.Label>Var</Statistic.Label>
      </Statistic>
    </Statistic.Group>
    <h5>Statistics between fields: <Label><Dropdown
      options={[{text: dataset.headers[dataset.measure0] + ' ~ ' + dataset.headers[dataset.measure1], value: 0}]}
      inline
      value={0}/>
    </Label></h5>
    <Statistic.Group widths='two' className='field-stats'>
      <Statistic>
        <Statistic.Value>{formatStat(rectStats.pearsonCorrelation)}</Statistic.Value>
        <Statistic.Label>Pearson Correlation</Statistic.Label>
      </Statistic>
      <Statistic>
        <Statistic.Value>{formatStat(rectStats.covariance)}</Statistic.Value>
        <Statistic.Label>Covariance</Statistic.Label>
      </Statistic>
    </Statistic.Group>
  </Segment>
};


export default StatsPanel;
