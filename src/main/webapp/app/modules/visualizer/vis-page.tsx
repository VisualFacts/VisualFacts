import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps} from 'react-router-dom';

import {IRootState} from 'app/shared/reducers';
import {
  getDataset,
  getIndexStatus, getRow,
  reset,
  selectDuplicateCluster,
  toggleDuplicates,
  unselectDuplicateCluster,
  updateAggType,
  updateClusters,
  updateDrawnRect,
  updateFilters,
  updateGroupBy,
  updateMapBounds,
  updateMeasure
} from './visualizer.reducer';
import Map from "app/modules/visualizer/map";
import './visualizer.scss';
import DedupChartCluster from "app/modules/visualizer/dedup-chart-cluster";
import StatsPanel from "app/modules/visualizer/stats-panel";
import Chart from "app/modules/visualizer/chart";
import DedupChart from "app/modules/visualizer/dedup-chart";
import VisControl from "app/modules/visualizer/vis-control";
import {Header, Modal, Progress} from "semantic-ui-react";
import QueryInfoPanel from "app/modules/visualizer/query-info-panel";

export interface IVisPageProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {
}

export const VisPage = (props: IVisPageProps) => {
  const {
    dataset,
    loading,
    loadingDups,
    indexStatus,
    clusters,
    duplicates,
    viewRect,
    series,
    rectStats,
    dedupStats,
    groupByCols,
    aggType,
    measureCol,
    categoricalFilters,
    facets, ioCount, pointCount, tileCount, fullyContainedTileCount,
    totalPointCount, zoom, totalTileCount, totalTime, executionTime,
    showDuplicates, selectedDedupClusterIndex, row
  } = props;

  useEffect(() => {
    props.getDataset(props.match.params.id);
    props.getIndexStatus(props.match.params.id);
  }, [props.match.params.id]);

  useEffect(() => {
    if (!indexStatus.isInitialized) {
      setTimeout(() => {
        props.getIndexStatus(props.match.params.id);
      }, 1000);
    } /* else if (viewRect) {
      props.updateClusters(props.match.params.id);
    }*/
  }, [indexStatus]);

  /*  return !loading && <Grid>
      <Grid.Column width={4}>
        <VisControl dataset={dataset} query={query} queryResults={queryResults} executeQuery={props.executeQuery}/>
      </Grid.Column>
      <Grid.Column width={12}>
        <Map id={props.match.params.id} clusters={clusters} updateMapBounds={props.updateMapBounds}/>
        <Divider hidden/>
        {query && query.groupByCol != null && <Chart dataset={dataset} query={query} queryResults={queryResults}/>}
      </Grid.Column>
    </Grid>;*/
  return !loading && <div>
    <VisControl dataset={dataset} groupByCols={groupByCols} categoricalFilters={categoricalFilters} facets={facets}
                updateFilters={props.updateFilters} reset={props.reset} toggleDuplicates={props.toggleDuplicates}
                showDuplicates={showDuplicates} allowDedup={props.allowDedup}/>
    <Map id={props.match.params.id} clusters={clusters} updateMapBounds={props.updateMapBounds}
         showDuplicates={showDuplicates}
         updateDrawnRect={props.updateDrawnRect} dataset={dataset}
         duplicates={duplicates} viewRect={viewRect} zoom={zoom} selectedDedupClusterIndex={selectedDedupClusterIndex}
         selectDuplicateCluster={props.selectDuplicateCluster}
         unselectDuplicateCluster={props.unselectDuplicateCluster} row={row} getRow={props.getRow}/>
    <div className='bottom-panel-group'>
      <QueryInfoPanel dataset={dataset}
                      fullyContainedTileCount={fullyContainedTileCount}
                      ioCount={ioCount}
                      pointCount={pointCount} tileCount={tileCount} totalPointCount={totalPointCount}
                      totalTileCount={totalTileCount} totalTime={totalTime} executionTime={executionTime}/>
    </div>
    <div className='right-panel-group'>
      {rectStats && <>
        {(dataset.measure0 != null && showDuplicates === false) &&
        <StatsPanel dataset={dataset} rectStats={rectStats}/>}
        {showDuplicates === false &&
        <Chart dataset={dataset} series={series} updateGroupBy={props.updateGroupBy} groupByCols={groupByCols}
               aggType={aggType} measureCol={measureCol} updateAggType={props.updateAggType}
               updateMeasure={props.updateMeasure}/>}
      </>}
      {rectStats && <>
        {/* {(dataset.measure0 != null && showDuplicates === true) && <DedupStatsPanel dataset={dataset} dedupStats = {dedupStats}/>} */}
        {showDuplicates && selectedDedupClusterIndex !== null &&
        <DedupChartCluster dataset={dataset} clusterIndex={selectedDedupClusterIndex}
                           duplicateCluster={duplicates[selectedDedupClusterIndex]}
                           unselectDuplicateCluster={props.unselectDuplicateCluster}/>}
        {showDuplicates && selectedDedupClusterIndex === null &&
        <DedupChart dedupStats={dedupStats} dataset={dataset}/>}
      </>}
    </div>
    <Modal
      basic
      open={!indexStatus.isInitialized}
      size='small'>
      <Header textAlign='center'>
        Parsing and indexing dataset {dataset.name}
      </Header>
      <Modal.Content>
        <Progress inverted value={indexStatus.objectsIndexed} total={dataset.objectCount} label={"Objects indexed: " + indexStatus.objectsIndexed} autoSuccess />
      </Modal.Content>
    </Modal>
    <Modal
      basic
      open={loadingDups}
      size='small'>
      <Header textAlign='center'>
        Deduplicating {dataset.name}
      </Header>
      {/* <Modal.Content>
        <Progress progress='percent' value={indexStatus.objectsIndexed} total={dataset.objectCount} autoSuccess precision={2}/>
      </Modal.Content> */}
    </Modal>
  </div>;
};

const mapStateToProps = ({visualizer}: IRootState) => ({
  loading: visualizer.loading,
  loadingDups: visualizer.loadingDups,
  dataset: visualizer.dataset,
  viewRect: visualizer.viewRect,
  drawnRect: visualizer.drawnRect,
  series: visualizer.series,
  rectStats: visualizer.rectStats,
  dedupStats: visualizer.dedupStats,
  clusters: visualizer.clusters,
  duplicates: visualizer.duplicates,
  groupByCols: visualizer.groupByCols,
  aggType: visualizer.aggType,
  measureCol: visualizer.measureCol,
  zoom: visualizer.zoom,
  categoricalFilters: visualizer.categoricalFilters,
  facets: visualizer.facets,
  indexStatus: visualizer.indexStatus,
  fullyContainedTileCount: visualizer.fullyContainedTileCount,
  tileCount: visualizer.tileCount,
  pointCount: visualizer.pointCount,
  ioCount: visualizer.ioCount,
  totalTileCount: visualizer.totalTileCount,
  totalPointCount: visualizer.totalPointCount,
  totalTime: visualizer.totalTime,
  executionTime: visualizer.executionTime,
  showDuplicates: visualizer.showDuplicates,
  allowDedup: visualizer.allowDedup,
  selectedDedupClusterIndex: visualizer.selectedDedupClusterIndex,
  row: visualizer.row,
});

const mapDispatchToProps = {
  getDataset,
  updateMapBounds,
  updateAggType,
  updateDrawnRect,
  updateGroupBy,
  updateMeasure,
  updateFilters,
  reset,
  getIndexStatus,
  updateClusters,
  toggleDuplicates,
  selectDuplicateCluster,
  unselectDuplicateCluster,
  getRow,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(VisPage);
