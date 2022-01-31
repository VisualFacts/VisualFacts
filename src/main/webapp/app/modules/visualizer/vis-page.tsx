import React, {useEffect} from 'react';
import {connect} from 'react-redux';
import {RouteComponentProps} from 'react-router-dom';

import {IRootState} from 'app/shared/reducers';
import {
  getDataset,
  getDatasets,
  getIndexStatus,
  getRow, getVisURL,
  reset,
  selectDuplicateCluster,
  toggleDuplicates,
  unselectDuplicateCluster,
  updateAggType,
  updateChartType,
  updateClusters,
  updateDedupColumn,
  updateDrawnRect,
  updateExpandedClusterIndex,
  updateFilters,
  updateGroupBy,
  updateMapBounds,
  updateMeasure,
} from './visualizer.reducer';
import Map from 'app/modules/visualizer/map';
import './visualizer.scss';
import DedupChartCluster from 'app/modules/visualizer/dedup-chart-cluster';
import StatsPanel from 'app/modules/visualizer/stats-panel';
import Chart from 'app/modules/visualizer/chart';
import VisControl from 'app/modules/visualizer/vis-control';
import {Header, Icon, Modal, Progress} from 'semantic-ui-react';
import QueryInfoPanel from 'app/modules/visualizer/query-info-panel';
import MapSearch from "app/modules/visualizer/map-search";

export interface IVisPageProps extends StateProps, DispatchProps, RouteComponentProps<{ id: string }> {
}

export const VisPage = (props: IVisPageProps) => {
  const {
    dataset,
    datasets,
    loading,
    loadingDups,
    indexStatus,
    clusters,
    duplicates,
    viewRect,
    series,
    cleanedSeries,
    rectStats,
    dedupStats,
    cleanedRectStats,
    groupByCols,
    aggType,
    chartType,
    measureCol,
    categoricalFilters,
    facets, ioCount, pointCount, tileCount, fullyContainedTileCount,
    totalPointCount, zoom, totalTileCount, totalTime, executionTime,
    showDuplicates, selectedDuplicate, row, dedupColumn
  } = props;

  useEffect(() => {
    props.getDataset(props.match.params.id, props.location.search);
    props.getDatasets();
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

  const copyCurrentURL = () => {
    const textArea = document.createElement('textarea');
    textArea.value = getVisURL({
      dataset, viewRect, measureCol, aggType, categoricalFilters, groupByCols, chartType
    });
    document.body.appendChild(textArea);
    textArea.select();
    const successful = document.execCommand('copy');
    document.body.removeChild(textArea);
  };

  return !loading && <div>
    <VisControl dataset={dataset} datasets={datasets} groupByCols={groupByCols} categoricalFilters={categoricalFilters}
                facets={facets}
                updateFilters={props.updateFilters} reset={props.reset} toggleDuplicates={props.toggleDuplicates}
                showDuplicates={showDuplicates} allowDedup={props.allowDedup} copyCurrentURL={copyCurrentURL}/>
    <Map id={props.match.params.id} clusters={clusters} updateMapBounds={props.updateMapBounds}
         showDuplicates={showDuplicates}
         updateDrawnRect={props.updateDrawnRect} dataset={dataset}
         viewRect={viewRect} zoom={zoom} selectedDuplicate={selectedDuplicate}
         selectDuplicateCluster={props.selectDuplicateCluster}
         updateExpandedClusterIndex={props.updateExpandedClusterIndex}
         unselectDuplicateCluster={props.unselectDuplicateCluster} row={row} getRow={props.getRow}
         expandedClusterIndex={props.expandedClusterIndex}/>
    <div className='bottom-panel-group'>
      <QueryInfoPanel dataset={dataset}
                      fullyContainedTileCount={fullyContainedTileCount}
                      ioCount={ioCount}
                      pointCount={pointCount} tileCount={tileCount} totalPointCount={totalPointCount}
                      totalTileCount={totalTileCount} totalTime={totalTime} executionTime={executionTime}/>
    </div>


    <div className='right-panel-group'>
      {rectStats && (selectedDuplicate === null) && <>
        {(dataset.measure0 != null) &&
        <StatsPanel dataset={dataset} rectStats={rectStats} showDuplicates={showDuplicates}
                    cleanedRectStats={cleanedRectStats} dedupStats={dedupStats}/>}
        <Chart dataset={dataset} series={series} cleanedSeries={cleanedSeries} updateGroupBy={props.updateGroupBy}
               groupByCols={groupByCols}
               aggType={aggType} chartType={chartType} updateChartType={props.updateChartType} measureCol={measureCol}
               updateAggType={props.updateAggType}
               updateMeasure={props.updateMeasure} dataSource={dataset.dataSource} showDuplicates={showDuplicates}/>
      </>}
      {(showDuplicates && selectedDuplicate !== null) &&
      <DedupChartCluster dataset={dataset}
                         duplicateCluster={selectedDuplicate}
                         dedupColumn={dedupColumn}
                         unselectDuplicateCluster={props.unselectDuplicateCluster}
                         updateDedupColumn={props.updateDedupColumn}/>}
    </div>
    <Modal
      basic
      open={!indexStatus.isInitialized}
      size='small'>
      <Header textAlign='center'>
        Parsing and indexing dataset {dataset.name}
      </Header>
      <Modal.Content>
        <Progress inverted value={indexStatus.objectsIndexed} total={dataset.objectCount}
                  label={"Objects indexed: " + indexStatus.objectsIndexed} autoSuccess/>
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
  </div>
};

const mapStateToProps = ({visualizer}: IRootState, ownProps) => ({
  loading: visualizer.loading,
  loadingDups: visualizer.loadingDups,
  dataset: visualizer.dataset,
  datasets: visualizer.datasets,
  viewRect: visualizer.viewRect,
  drawnRect: visualizer.drawnRect,
  series: visualizer.series,
  cleanedSeries: visualizer.cleanedSeries,
  rectStats: visualizer.rectStats,
  dedupStats: visualizer.dedupStats,
  clusters: visualizer.clusters,
  duplicates: visualizer.duplicates,
  groupByCols: visualizer.groupByCols,
  chartType: visualizer.chartType,
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
  selectedDuplicate: visualizer.selectedDuplicate,
  row: visualizer.row,
  dedupColumn: visualizer.dedupColumn,
  expandedClusterIndex: visualizer.expandedClusterIndex,
  cleanedRectStats: visualizer.cleanedRectStats,
});

const mapDispatchToProps = {
  getDataset,
  getDatasets,
  updateMapBounds,
  updateAggType,
  updateChartType,
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
  updateDedupColumn,
  updateExpandedClusterIndex,
};

type StateProps = ReturnType<typeof mapStateToProps>;
type DispatchProps = typeof mapDispatchToProps;

// @ts-ignore
export default connect(mapStateToProps, mapDispatchToProps)(VisPage);
