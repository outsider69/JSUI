//region: imports
import React, { Component, Fragment } from 'react';
import { inject, observer } from 'mobx-react';
import { reaction } from 'mobx';
import keydown from 'react-keydown';
import { remote } from 'electron';

//icons
import {
  faCode,
  faMagic,
  faBoxes,
  faTrashAlt,
  faSyncAlt,
  faFolder,
  faPlug,
  faCogs
} from '@fortawesome/fontawesome-free-solid/index';

//utils
import get from 'lodash/get';

//styles
import * as S from './styles';
import * as A from 'styles/shared-components';
import { Horizontal, Vertical } from 'styles/flex-components';
import { spaceUnit } from 'styles/shared-components';

//components
import DependenciesList from 'components/DependenciesList';
import ProjectTree from 'components/ProjectTree';
import PopupSelector from 'components/PopupSelector';
import Header from 'components/Header';
import IconWithTip from 'components/IconWithTip';
import Dialog from 'components/Dialog';
import ListOfBlocks from 'components/ListOfBlocks';
import InstallDependencyForm from 'components/InstallDependencyForm';
import GitBranch from 'components/GitBranch';
import ScriptsList from 'components/ScriptsList';

//external components
import { Tooltip } from 'react-tippy';

//local components
import FileEntry from './components/FileEntry';

import Boolean from 'models/Boolean';
import String from 'models/String';

const plugins = remote.require('./plugins/index');

//endregion
@inject('store')
@observer
class ProjectView extends Component {
  pluginDialogOpen = Boolean.create();
  generatorsDialogOpen = Boolean.create();
  searchOpened = Boolean.create();
  dependenciesDialogOpen = String.create();

  @keydown(['cmd+shift+n'])
  submit() {
    this.searchOpened.setTrue();
  }

  componentDidMount() {
    this.clearReaction = reaction(
      () => this.props.store.currentProject,
      nextProject => {
        nextProject && nextProject.readContents();
      },
      {
        fireImmediately: true
      }
    );
  }

  componentWillUnmount() {
    this.clearReaction();
  }

  render() {
    const { store, overrides } = this.props;
    const { searchOpened } = overrides || this;
    const { currentProject: project } = store;
    const hasScripts = project.packageJson && project.packageJson.scripts;

    const dependenciesListProps = {
      onDelete: project.deleteDependency,
      onUpgrade: project.upgradeDependency,
      onMove: project.moveDependency
    };

    const spaceAll = spaceUnit * 3;

    const mappedItems = project.allItems.map(({ path, ...rest }) => ({
      id: path,
      ...rest
    }));

    const shouldOpenSearch = searchOpened.value && mappedItems && mappedItems.length > 0;
    const hasGenerators = project.generatorList && project.generatorList.length > 0;
    const showFiles = project.contents && store.settings.indexFiles;

    return (
      <S.ProjectView>
        <Header>
          <A.Horizontal spaceAll={8}>
            <S.Title>{project.name}</S.Title>
          </A.Horizontal>
        </Header>

        <A.Horizontal flex={1}>
          {showFiles && <ProjectTree contents={project.contents} />}
          <A.Vertical flex={1}>
            <S.InfoStrip centerHorizontalV spaceBetween>
              <A.Horizontal centerV spaceAll={10}>
                <div>Version: {project.packageJson && project.packageJson.version}</div>

                {(project.origin || project.gitBranch) && (
                  <Fragment>
                    <A.VerticalSeparator />
                    {project.origin && (
                      <Tooltip title={project.origin} position="bottom">
                        <A.SmallButton onClick={project.goToOrigin}>git</A.SmallButton>
                      </Tooltip>
                    )}
                    {project.gitBranch && <GitBranch branchName={project.gitBranch} />}
                  </Fragment>
                )}
              </A.Horizontal>

              <A.Horizontal spaceAll={15}>
                <IconWithTip tip="Install dependencies" icon={faBoxes} onClick={project.installNodeModules} />

                <IconWithTip
                  tip="Delete node_modules folder"
                  icon={faTrashAlt}
                  onClick={project.deleteNodeModulesFolder}
                />

                <IconWithTip
                  tip="Reinstall dependencies"
                  icon={faSyncAlt}
                  onClick={project.reinstallDependencies}
                />

                <A.VerticalSeparator />

                {hasGenerators && (
                  <IconWithTip
                    tip="Generate with plop"
                    icon={faCogs}
                    onClick={this.generatorsDialogOpen.setTrue}
                  />
                )}
                <IconWithTip tip="Apply plugin" icon={faMagic} onClick={this.pluginDialogOpen.setTrue} />

                <A.VerticalSeparator />

                <IconWithTip tip="Open in Finder" icon={faFolder} onClick={project.openDir} />
                <IconWithTip tip="Edit code" icon={faCode} onClick={project.edit} />
              </A.Horizontal>
            </S.InfoStrip>
            <S.Mid hasProcesses={false}>
              <S.Right>
                {project.ready && (
                  <React.Fragment>
                    {hasScripts && (
                      <React.Fragment>
                        {/*<S.Section.Title> Scripts </S.Section.Title>*/}
                        <A.Space size={3} />
                        <Horizontal wrap spaceBottom spaceAll={spaceAll}>
                          <ScriptsList packageJson={project.packageJson} />
                        </Horizontal>
                      </React.Fragment>
                    )}

                    {/* Dependencies */}
                    <Horizontal spaceAll={10} flex={1}>
                      {/* Dependencies list */}
                      <Vertical flex={1}>
                        <Horizontal centerV css={{ minHeight: 30 }} wrap spaceAll={spaceAll}>
                          <S.Section.Title> Dependencies </S.Section.Title>
                          <Tooltip title="Add a dependency">
                            <A.SmallButton onClick={() => this.dependenciesDialogOpen.setValue('open')}>
                              add
                            </A.SmallButton>
                          </Tooltip>
                        </Horizontal>
                        {get(project, 'packageJson.dependencies') && (
                          <DependenciesList
                            {...dependenciesListProps}
                            list={project.packageJson.dependencies}
                          />
                        )}
                      </Vertical>

                      {/* Dev dependencies list */}

                      <Vertical flex={1}>
                        <Horizontal centerV css={{ minHeight: 30 }} wrap spaceAll={spaceAll}>
                          <S.Section.Title> Dev dependencies </S.Section.Title>
                          <Tooltip title="Add a dev dependency">
                            <A.SmallButton onClick={() => this.dependenciesDialogOpen.setValue('dev')}>
                              add
                            </A.SmallButton>
                          </Tooltip>
                        </Horizontal>
                        {get(project, 'packageJson.devDependencies') && (
                          <DependenciesList
                            {...dependenciesListProps}
                            isDev={true}
                            list={project.packageJson.devDependencies}
                          />
                        )}
                      </Vertical>
                    </Horizontal>
                  </React.Fragment>
                )}
              </S.Right>
            </S.Mid>
          </A.Vertical>

          {shouldOpenSearch && (
            <PopupSelector
              closeOnChoose={true}
              renderItem={item => <FileEntry item={item} />}
              showSearch={true}
              items={mappedItems}
              onChoose={entry => store.setOpenedFile(entry.id)}
              onEsc={this.searchOpened.setFalse}
            />
          )}

          {this.pluginDialogOpen.value === true && (
            <Dialog onClose={this.pluginDialogOpen.setFalse} onEsc={this.pluginDialogOpen.setFalse}>
              <A.Padding>
                <ListOfBlocks
                  list={plugins}
                  onPick={plugin => {
                    project.applyPlugin(plugin);
                    this.pluginDialogOpen.setFalse();
                  }}
                />
              </A.Padding>
            </Dialog>
          )}

          {this.generatorsDialogOpen.value === true && (
            <Dialog onClose={this.generatorsDialogOpen.setFalse} onEsc={this.generatorsDialogOpen.setFalse}>
              <A.Padding>
                <ListOfBlocks
                  list={project.generatorList}
                  onPick={generator => {
                    project.generate(generator.name);
                    this.generatorsDialogOpen.setFalse();
                  }}
                />
              </A.Padding>
            </Dialog>
          )}

          {this.dependenciesDialogOpen.hasValue && (
            <Dialog onClose={this.dependenciesDialogOpen.clear}>
              <InstallDependencyForm
                isDev={this.dependenciesDialogOpen.value === 'dev'}
                onCancel={this.dependenciesDialogOpen.clear}
                onSubmit={formValues => {
                  project.installDependency(formValues);
                  this.dependenciesDialogOpen.clear();
                }}
              />
            </Dialog>
          )}
        </A.Horizontal>
      </S.ProjectView>
    );
  }
}

export default ProjectView;
