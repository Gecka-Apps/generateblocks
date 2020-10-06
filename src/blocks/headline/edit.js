/**
 * Block: Headline
 */

import classnames from 'classnames';
import ColorPicker from '../../components/color-picker';
import IconPicker from '../../components/icon-picker';
import TypographyControls from '../../components/typography';
import DimensionsControl from '../../components/dimensions/';
import ResponsiveTabs from '../../components/responsive-tabs';
import getIcon from '../../utils/get-icon';
import sanitizeSVG from '../../utils/sanitize-svg';
import DesktopCSS from './css/desktop.js';
import TabletCSS from './css/tablet.js';
import MobileCSS from './css/mobile.js';
import PanelArea from '../../components/panel-area/';
import Text from './text-tag';
import './markformat';

const {
	__,
	_x,
	sprintf,
} = wp.i18n; // Import __() from wp.i18n
const {
	TextControl,
	Toolbar,
	SelectControl,
	DropdownMenu,
	ToggleControl,
	Tooltip,
	Button,
	ButtonGroup,
} = wp.components;

const {
	Fragment,
	Component,
} = wp.element;

const {
	InspectorControls,
	RichText,
	BlockControls,
	AlignmentToolbar,
	InspectorAdvancedControls,
} = wp.blockEditor;

const {
	applyFilters,
} = wp.hooks;

const {
	withSelect,
	withDispatch,
} = wp.data;

const {
	compose,
} = wp.compose;

/**
 * Regular expression matching invalid anchor characters for replacement.
 *
 * @type {RegExp}
 */
const ANCHOR_REGEX = /[\s#]/g;

const gbHeadlineIds = [];

class GenerateBlockHeadline extends Component {
	constructor() {
		super( ...arguments );

		this.getFontSizePlaceholder = this.getFontSizePlaceholder.bind( this );

		this.state = {
			selectedDevice: 'Desktop',
			fontSizePlaceholder: '17',
		};
	}

	componentDidMount() {
		const id = this.props.clientId.substr( 2, 9 ).replace( '-', '' );

		if ( ! this.props.attributes.uniqueId ) {
			this.props.setAttributes( {
				uniqueId: id,
			} );

			gbHeadlineIds.push( id );
		} else if ( gbHeadlineIds.includes( this.props.attributes.uniqueId ) ) {
			this.props.setAttributes( {
				uniqueId: id,
			} );

			gbHeadlineIds.push( id );
		} else {
			gbHeadlineIds.push( this.props.attributes.uniqueId );
		}

		const tempFontSizePlaceholder = this.getFontSizePlaceholder();

		if ( tempFontSizePlaceholder !== this.state.fontSizePlaceholder ) {
			this.setState( {
				fontSizePlaceholder: tempFontSizePlaceholder,
			} );
		}

		// hasIcon came late, so let's set it on mount if we have an icon.
		if ( ! this.props.attributes.hasIcon && this.props.attributes.icon ) {
			this.props.setAttributes( {
				hasIcon: true,
			} );
		}
	}

	componentDidUpdate() {
		const tempFontSizePlaceholder = this.getFontSizePlaceholder();

		if ( tempFontSizePlaceholder !== this.state.fontSizePlaceholder ) {
			this.setState( {
				fontSizePlaceholder: tempFontSizePlaceholder,
			} );
		}
	}

	getFontSizePlaceholder() {
		let placeholder = '25';

		if ( 'em' === this.props.attributes.fontSizeUnit ) {
			placeholder = '1';
		} else if ( '%' === this.props.attributes.fontSizeUnit ) {
			placeholder = '100';
		} else {
			const headlineId = document.querySelector( '.gb-headline-' + this.props.attributes.uniqueId );

			if ( headlineId ) {
				placeholder = parseFloat( window.getComputedStyle( headlineId ).fontSize );
			}
		}

		return placeholder;
	}

	getDeviceType() {
		return this.props.deviceType ? this.props.deviceType : this.state.selectedDevice;
	}

	setDeviceType = ( deviceType ) => {
		if ( this.props.deviceType ) {
			this.props.setDeviceType( deviceType );
		} else {
			this.setState( { selectedDevice: deviceType } );
		}
	};

	render() {
		const {
			attributes,
			setAttributes,
		} = this.props;

		const {
			fontSizePlaceholder,
		} = this.state;

		const {
			uniqueId,
			anchor,
			className,
			content,
			element,
			alignment,
			alignmentTablet,
			alignmentMobile,
			backgroundColor,
			backgroundColorOpacity,
			textColor,
			linkColor,
			linkColorHover,
			borderColor,
			borderColorOpacity,
			highlightTextColor,
			fontFamily,
			googleFont,
			googleFontVariants,
			marginTop,
			marginRight,
			marginBottom,
			marginLeft,
			icon,
			hasIcon,
			iconColor,
			iconColorOpacity,
			iconLocation,
			iconLocationTablet,
			iconLocationMobile,
			iconVerticalAlignment,
			iconVerticalAlignmentTablet,
			iconVerticalAlignmentMobile,
			iconSize,
			iconSizeTablet,
			iconSizeMobile,
			iconSizeUnit,
			inlineWidth,
			inlineWidthTablet,
			inlineWidthMobile,
			removeText,
			ariaLabel,
		} = attributes;

		let googleFontsAttr = '';

		if ( googleFontVariants ) {
			googleFontsAttr = ':' + googleFontVariants;
		}

		const unitSizes = [
			{
				name: _x( 'Pixel', 'A size unit for CSS markup', 'generateblocks' ),
				unitValue: 'px',
			},
			{
				name: _x( 'Em', 'A size unit for CSS markup', 'generateblocks' ),
				unitValue: 'em',
			},
		];

		let iconSizePlaceholderMobile = '';

		if ( iconSizeTablet || 0 === iconSizeTablet ) {
			iconSizePlaceholderMobile = iconSizeTablet;
		} else if ( iconSize || 0 === iconSize ) {
			iconSizePlaceholderMobile = iconSize;
		} else {
			iconSizePlaceholderMobile = '';
		}

		return (
			<Fragment>

				<BlockControls>
					<Toolbar>
						<DropdownMenu
							icon={ getIcon( 'paragraph' ) }
							label={ __( 'Element', 'generateblocks' ) }
							controls={ [
								{
									title: 'paragraph',
									onClick: () => {
										setAttributes( { element: 'p' } );

										if ( ! marginTop && ! marginRight && ! marginBottom && ! marginLeft ) {
											setAttributes( { marginUnit: 'em' } );
										}
									},
								},
								{
									title: 'h1',
									onClick: () => {
										setAttributes( { element: 'h1' } );

										if ( ! marginTop && ! marginRight && ! marginBottom && ! marginLeft ) {
											setAttributes( { marginUnit: generateBlocksDefaults.headline.marginUnit } );
										}
									},
								},
								{
									title: 'h2',
									onClick: () => {
										setAttributes( { element: 'h2' } );

										if ( ! marginTop && ! marginRight && ! marginBottom && ! marginLeft ) {
											setAttributes( { marginUnit: generateBlocksDefaults.headline.marginUnit } );
										}
									},
								},
								{
									title: 'h3',
									onClick: () => {
										setAttributes( { element: 'h3' } );

										if ( ! marginTop && ! marginRight && ! marginBottom && ! marginLeft ) {
											setAttributes( { marginUnit: generateBlocksDefaults.headline.marginUnit } );
										}
									},
								},
								{
									title: 'h4',
									onClick: () => {
										setAttributes( { element: 'h4' } );

										if ( ! marginTop && ! marginRight && ! marginBottom && ! marginLeft ) {
											setAttributes( { marginUnit: generateBlocksDefaults.headline.marginUnit } );
										}
									},
								},
							] }
						/>
					</Toolbar>

					{ ! inlineWidth &&
						<AlignmentToolbar
							isCollapsed={ false }
							value={ alignment }
							onChange={ ( nextAlign ) => {
								setAttributes( { alignment: nextAlign } );
							} }
						/>
					}
				</BlockControls>

				<InspectorControls>
					<ResponsiveTabs { ...this.props }
						selectedDevice={ this.getDeviceType() }
						onClick={ ( device ) => {
							this.setDeviceType( device );
						} }
					/>

					<PanelArea { ...this.props }
						id={ 'headlineElement' }
						state={ this.state }
						showPanel={ 'Desktop' === this.getDeviceType() ? true : false }
					>
						<SelectControl
							label={ __( 'Element', 'generateblocks' ) }
							value={ element }
							options={ [
								{ label: 'paragraph', value: 'p' },
								{ label: 'div', value: 'div' },
								{ label: 'span', value: 'span' },
								{ label: 'h1', value: 'h1' },
								{ label: 'h2', value: 'h2' },
								{ label: 'h3', value: 'h3' },
								{ label: 'h4', value: 'h4' },
								{ label: 'h5', value: 'h5' },
								{ label: 'h6', value: 'h6' },
							] }
							onChange={ ( value ) => {
								setAttributes( {
									element: value,
								} );

								if ( ! marginTop && ! marginRight && ! marginBottom && ! marginLeft ) {
									if ( 'p' === value ) {
										setAttributes( { marginUnit: 'em' } );
									} else {
										setAttributes( { marginUnit: generateBlocksDefaults.headline.marginUnit } );
									}
								}
							} }
						/>

						{ applyFilters( 'generateblocks.editor.controls', '', 'headlineElement', this.props, this.state ) }
					</PanelArea>

					<PanelArea { ...this.props }
						title={ __( 'Typography', 'generateblocks' ) }
						initialOpen={ false }
						icon={ getIcon( 'typography' ) }
						className={ 'gblocks-panel-label' }
						id={ 'headlineTypography' }
						state={ this.state }
						showPanel={ ! removeText || false }
					>
						{ 'Desktop' === this.getDeviceType() && (
							<Fragment>
								{ ! inlineWidth &&
									<AlignmentToolbar
										isCollapsed={ false }
										value={ alignment }
										onChange={ ( value ) => {
											setAttributes( { alignment: value } );
										} }
									/>
								}

								<TypographyControls { ...this.props }
									showFontFamily={ true }
									showFontWeight={ true }
									showTextTransform={ true }
									showFontSize={ true }
									showLineHeight={ true }
									showLetterSpacing={ true }
									fontSizePlaceholder={ fontSizePlaceholder }
									defaultFontSize={ generateBlocksDefaults.headline.fontSize }
									defaultFontSizeUnit={ generateBlocksDefaults.headline.fontSizeUnit }
									defaultLineHeight={ generateBlocksDefaults.headline.lineHeight }
									defaultLineHeightUnit={ generateBlocksDefaults.headline.lineHeightUnit }
									defaultLetterSpacing={ generateBlocksDefaults.headline.letterSpacing }
								/>
							</Fragment>
						) }

						{ 'Tablet' === this.getDeviceType() && (
							<Fragment>
								{ ! inlineWidthTablet &&
									<AlignmentToolbar
										isCollapsed={ false }
										value={ alignmentTablet }
										onChange={ ( value ) => {
											setAttributes( { alignmentTablet: value } );
										} }
									/>
								}

								<TypographyControls { ...this.props }
									device={ 'Tablet' }
									showFontSize={ true }
									showLineHeight={ true }
									showLetterSpacing={ true }
									defaultFontSize={ generateBlocksDefaults.headline.fontSizeTablet }
									defaultFontSizeUnit={ generateBlocksDefaults.headline.fontSizeUnit }
									defaultLineHeight={ generateBlocksDefaults.headline.lineHeightTablet }
									defaultLineHeightUnit={ generateBlocksDefaults.headline.lineHeightUnit }
									defaultLetterSpacing={ generateBlocksDefaults.headline.letterSpacingTablet }
								/>
							</Fragment>
						) }

						{ 'Mobile' === this.getDeviceType() && (
							<Fragment>
								{ ! inlineWidthMobile &&
									<AlignmentToolbar
										isCollapsed={ false }
										value={ alignmentMobile }
										onChange={ ( value ) => {
											setAttributes( { alignmentMobile: value } );
										} }
									/>
								}

								<TypographyControls { ...this.props }
									device={ 'Mobile' }
									showFontSize={ true }
									showLineHeight={ true }
									showLetterSpacing={ true }
									defaultFontSize={ generateBlocksDefaults.headline.fontSizeMobile }
									defaultFontSizeUnit={ generateBlocksDefaults.headline.fontSizeUnit }
									defaultLineHeight={ generateBlocksDefaults.headline.lineHeightMobile }
									defaultLineHeightUnit={ generateBlocksDefaults.headline.lineHeightUnit }
									defaultLetterSpacing={ generateBlocksDefaults.headline.letterSpacingMobile }
								/>
							</Fragment>
						) }

						{ applyFilters( 'generateblocks.editor.controls', '', 'headlineTypography', this.props, this.state ) }
					</PanelArea>

					<PanelArea { ...this.props }
						title={ __( 'Spacing', 'generateblocks' ) }
						initialOpen={ false }
						icon={ getIcon( 'spacing' ) }
						className={ 'gblocks-panel-label' }
						id={ 'headlineSpacing' }
						state={ this.state }
					>
						{ 'Desktop' === this.getDeviceType() && (
							<Fragment>
								<ToggleControl
									label={ __( 'Inline Width', 'generateblocks' ) }
									checked={ !! inlineWidth }
									onChange={ ( value ) => {
										setAttributes( {
											inlineWidth: value,
										} );
									} }
								/>

								<DimensionsControl { ...this.props }
									device={ this.getDeviceType() }
									type={ 'padding' }
									label={ __( 'Padding', 'generateblocks' ) }
									attrTop={ 'paddingTop' }
									attrRight={ 'paddingRight' }
									attrBottom={ 'paddingBottom' }
									attrLeft={ 'paddingLeft' }
									attrUnit={ 'paddingUnit' }
									attrSyncUnits={ 'paddingSyncUnits' }
									defaults={ generateBlocksDefaults.headline }
								/>

								<DimensionsControl { ...this.props }
									device={ this.getDeviceType() }
									type={ 'margin' }
									block={ 'headline' }
									label={ __( 'Margin', 'generateblocks' ) }
									attrTop={ 'marginTop' }
									attrRight={ 'marginRight' }
									attrBottom={ 'marginBottom' }
									attrLeft={ 'marginLeft' }
									attrUnit={ 'marginUnit' }
									attrSyncUnits={ 'marginSyncUnits' }
									defaults={ generateBlocksDefaults.headline }
								/>

								<DimensionsControl { ...this.props }
									device={ this.getDeviceType() }
									type={ 'padding' }
									label={ __( 'Border Size', 'generateblocks' ) }
									attrTop={ 'borderSizeTop' }
									attrRight={ 'borderSizeRight' }
									attrBottom={ 'borderSizeBottom' }
									attrLeft={ 'borderSizeLeft' }
									attrSyncUnits={ 'borderSizeSyncUnits' }
									displayUnit={ 'px' }
									defaults={ generateBlocksDefaults.headline }
								/>
							</Fragment>
						) }

						{ 'Tablet' === this.getDeviceType() && (
							<Fragment>
								<ToggleControl
									label={ __( 'Inline Width', 'generateblocks' ) }
									checked={ !! inlineWidthTablet }
									onChange={ ( value ) => {
										setAttributes( {
											inlineWidthTablet: value,
										} );
									} }
								/>

								<DimensionsControl { ...this.props }
									device={ this.getDeviceType() }
									type={ 'padding' }
									label={ __( 'Padding', 'generateblocks' ) }
									attrTop={ 'paddingTopTablet' }
									attrRight={ 'paddingRightTablet' }
									attrBottom={ 'paddingBottomTablet' }
									attrLeft={ 'paddingLeftTablet' }
									attrUnit={ 'paddingUnit' }
									attrSyncUnits={ 'paddingSyncUnits' }
									defaults={ generateBlocksDefaults.headline }
								/>

								<DimensionsControl { ...this.props }
									device={ this.getDeviceType() }
									type={ 'margin' }
									block={ 'headline' }
									label={ __( 'Margin', 'generateblocks' ) }
									attrTop={ 'marginTopTablet' }
									attrRight={ 'marginRightTablet' }
									attrBottom={ 'marginBottomTablet' }
									attrLeft={ 'marginLeftTablet' }
									attrUnit={ 'marginUnit' }
									attrSyncUnits={ 'marginSyncUnits' }
									defaults={ generateBlocksDefaults.headline }
								/>

								<DimensionsControl { ...this.props }
									device={ this.getDeviceType() }
									type={ 'padding' }
									label={ __( 'Border Size', 'generateblocks' ) }
									attrTop={ 'borderSizeTopTablet' }
									attrRight={ 'borderSizeRightTablet' }
									attrBottom={ 'borderSizeBottomTablet' }
									attrLeft={ 'borderSizeLeftTablet' }
									attrSyncUnits={ 'borderSizeSyncUnits' }
									displayUnit={ 'px' }
									defaults={ generateBlocksDefaults.headline }
								/>
							</Fragment>
						) }

						{ 'Mobile' === this.getDeviceType() && (
							<Fragment>
								<ToggleControl
									label={ __( 'Inline Width', 'generateblocks' ) }
									checked={ !! inlineWidthMobile }
									onChange={ ( value ) => {
										setAttributes( {
											inlineWidthMobile: value,
										} );
									} }
								/>

								<DimensionsControl { ...this.props }
									device={ this.getDeviceType() }
									type={ 'padding' }
									label={ __( 'Padding', 'generateblocks' ) }
									attrTop={ 'paddingTopMobile' }
									attrRight={ 'paddingRightMobile' }
									attrBottom={ 'paddingBottomMobile' }
									attrLeft={ 'paddingLeftMobile' }
									attrUnit={ 'paddingUnit' }
									attrSyncUnits={ 'paddingSyncUnits' }
									defaults={ generateBlocksDefaults.headline }
								/>

								<DimensionsControl { ...this.props }
									device={ this.getDeviceType() }
									type={ 'margin' }
									block={ 'headline' }
									label={ __( 'Margin', 'generateblocks' ) }
									attrTop={ 'marginTopMobile' }
									attrRight={ 'marginRightMobile' }
									attrBottom={ 'marginBottomMobile' }
									attrLeft={ 'marginLeftMobile' }
									attrUnit={ 'marginUnit' }
									attrSyncUnits={ 'marginSyncUnits' }
									defaults={ generateBlocksDefaults.headline }
								/>

								<DimensionsControl { ...this.props }
									device={ this.getDeviceType() }
									type={ 'padding' }
									label={ __( 'Border Size', 'generateblocks' ) }
									attrTop={ 'borderSizeTopMobile' }
									attrRight={ 'borderSizeRightMobile' }
									attrBottom={ 'borderSizeBottomMobile' }
									attrLeft={ 'borderSizeLeftMobile' }
									attrSyncUnits={ 'borderSizeSyncUnits' }
									displayUnit={ 'px' }
									defaults={ generateBlocksDefaults.headline }
								/>
							</Fragment>
						) }

						{ applyFilters( 'generateblocks.editor.controls', '', 'headlineSpacing', this.props, this.state ) }
					</PanelArea>

					<PanelArea { ...this.props }
						title={ __( 'Colors', 'generateblocks' ) }
						initialOpen={ false }
						icon={ getIcon( 'colors' ) }
						className={ 'gblocks-panel-label' }
						id={ 'headlineColors' }
						state={ this.state }
						showPanel={ 'Desktop' === this.getDeviceType() || false }
					>
						<ColorPicker
							label={ __( 'Background Color', 'generateblocks' ) }
							value={ backgroundColor }
							alpha={ true }
							valueOpacity={ backgroundColorOpacity }
							attrOpacity={ 'backgroundColorOpacity' }
							onChange={ ( value ) =>
								setAttributes( {
									backgroundColor: value,
								} )
							}
							onOpacityChange={ ( value ) =>
								setAttributes( {
									backgroundColorOpacity: value,
								} )
							}
						/>

						<ColorPicker
							label={ __( 'Text Color', 'generateblocks' ) }
							value={ textColor }
							alpha={ false }
							onChange={ ( value ) =>
								setAttributes( {
									textColor: value,
								} )
							}
						/>

						<ColorPicker
							label={ __( 'Link Color', 'generateblocks' ) }
							value={ linkColor }
							alpha={ false }
							onChange={ ( value ) =>
								setAttributes( {
									linkColor: value,
								} )
							}
						/>

						<ColorPicker
							label={ __( 'Link Color Hover', 'generateblocks' ) }
							value={ linkColorHover }
							alpha={ false }
							onChange={ ( value ) =>
								setAttributes( {
									linkColorHover: value,
								} )
							}
						/>

						<ColorPicker
							label={ __( 'Border Color', 'generateblocks' ) }
							value={ borderColor }
							alpha={ true }
							valueOpacity={ borderColorOpacity }
							attrOpacity={ 'borderColorOpacity' }
							onChange={ ( value ) =>
								setAttributes( {
									borderColor: value,
								} )
							}
							onOpacityChange={ ( value ) =>
								setAttributes( {
									borderColorOpacity: value,
								} )
							}
						/>

						{ icon &&
							<ColorPicker
								label={ __( 'Icon Color', 'generateblocks' ) }
								value={ iconColor }
								alpha={ true }
								valueOpacity={ iconColorOpacity }
								attrOpacity={ 'iconColorOpacity' }
								onChange={ ( value ) =>
									setAttributes( {
										iconColor: value,
									} )
								}
								onOpacityChange={ ( value ) =>
									setAttributes( {
										iconColorOpacity: value,
									} )
								}
							/>
						}

						<ColorPicker
							label={ __( 'Highlight Text', 'generateblocks' ) }
							value={ highlightTextColor }
							alpha={ false }
							onChange={ ( value ) =>
								setAttributes( {
									highlightTextColor: value,
								} )
							}
						/>
					</PanelArea>

					<PanelArea { ...this.props }
						title={ __( 'Icon', 'generateblocks' ) }
						initialOpen={ false }
						icon={ getIcon( 'icons' ) }
						className={ 'gblocks-panel-label' }
						id={ 'headlineIcon' }
						state={ this.state }
						showPanel={ 'Desktop' === this.getDeviceType() || !! icon ? true : false }
					>

						{ 'Desktop' === this.getDeviceType() &&
							<IconPicker { ...this.props }
								attrIcon={ 'icon' }
								attrRemoveText={ 'removeText' }
								attrAriaLabel={ 'ariaLabel' }
							/>
						}

						{ 'Desktop' === this.getDeviceType() && !! icon &&
							<Fragment>
								{ ! removeText &&
									<Fragment>
										<SelectControl
											label={ __( 'Icon Location', 'generateblocks' ) }
											value={ iconLocation }
											options={ [
												{ label: __( 'Inline', 'generateblocks' ), value: 'inline' },
												{ label: __( 'Above', 'generateblocks' ), value: 'above' },
											] }
											onChange={ ( value ) => {
												setAttributes( {
													iconLocation: value,
													iconPaddingRight: 'inline' === value ? '0.5' : '',
													iconPaddingBottom: 'above' === value ? '0.5' : '',
												} );
											} }
										/>

										{ 'inline' === iconLocation &&
											<SelectControl
												label={ __( 'Icon Alignment', 'generateblocks' ) }
												value={ iconVerticalAlignment }
												options={ [
													{ label: __( 'Top', 'generateblocks' ), value: 'top' },
													{ label: __( 'Center', 'generateblocks' ), value: 'center' },
													{ label: __( 'Bottom', 'generateblocks' ), value: 'bottom' },
												] }
												onChange={ ( value ) => {
													setAttributes( {
														iconVerticalAlignment: value,
													} );
												} }
											/>
										}

										<DimensionsControl { ...this.props }
											device={ this.getDeviceType() }
											type={ 'padding' }
											label={ __( 'Padding', 'generateblocks' ) }
											attrTop={ 'iconPaddingTop' }
											attrRight={ 'iconPaddingRight' }
											attrBottom={ 'iconPaddingBottom' }
											attrLeft={ 'iconPaddingLeft' }
											attrUnit={ 'iconPaddingUnit' }
											attrSyncUnits={ 'iconPaddingSyncUnits' }
											defaults={ generateBlocksDefaults.headline }
										/>
									</Fragment>
								}

								<div className="components-gblocks-typography-control__header">
									<div className="components-gblocks-typography-control__label components-base-control__label">
										{ __( 'Icon Size', 'generateblocks' ) }
									</div>

									<div className="components-gblocks-control__units">
										<ButtonGroup className="components-gblocks-typography-control__units" aria-label={ __( 'Select Units', 'generateblocks' ) }>
											{ unitSizes.map( ( unit ) =>
												/* translators: %s: values associated with CSS syntax, 'Pixel', 'Em', 'Percentage' */
												<Tooltip text={ sprintf( __( '%s Units', 'generateblocks' ), unit.name ) } key={ unit.unitValue }>
													<Button
														key={ unit.unitValue }
														className={ 'components-gblocks-typography-control__units--' + unit.name }
														isSmall
														isPrimary={ iconSizeUnit === unit.unitValue }
														aria-pressed={ iconSizeUnit === unit.unitValue }
														/* translators: %s: values associated with CSS syntax, 'Pixel', 'Em', 'Percentage' */
														aria-label={ sprintf( __( '%s Units', 'generateblocks' ), unit.name ) }
														onClick={ () => setAttributes( { iconSizeUnit: unit.unitValue } ) }
													>
														{ unit.unitValue }
													</Button>
												</Tooltip>
											) }
										</ButtonGroup>
									</div>
								</div>

								<div className="components-base-control components-gblocks-typography-control__inputs">
									<TextControl
										type={ 'number' }
										value={ iconSize || 0 === iconSize ? iconSize : '' }
										step={ 'em' === iconSizeUnit ? .1 : 1 }
										onChange={ ( value ) => {
											setAttributes( {
												iconSize: value,
											} );
										} }
										onBlur={ () => {
											setAttributes( {
												iconSize: parseFloat( iconSize ),
											} );
										} }
										onClick={ ( e ) => {
											// Make sure onBlur fires in Firefox.
											e.currentTarget.focus();
										} }
									/>

									<Button
										isSmall
										isSecondary
										className="components-gblocks-default-number"
										onClick={ () => {
											setAttributes( {
												iconSize: generateBlocksDefaults.headline.iconSize,
											} );
										} }
									>
										{ __( 'Reset', 'generateblocks' ) }
									</Button>
								</div>
							</Fragment>
						}

						{ 'Tablet' === this.getDeviceType() && !! icon &&
							<Fragment>
								{ ! removeText &&
									<Fragment>
										<SelectControl
											label={ __( 'Icon Location', 'generateblocks' ) }
											value={ iconLocationTablet }
											options={ [
												{ label: __( 'Inherit', 'generateblocks' ), value: '' },
												{ label: __( 'Inline', 'generateblocks' ), value: 'inline' },
												{ label: __( 'Above', 'generateblocks' ), value: 'above' },
											] }
											onChange={ ( value ) => {
												setAttributes( {
													iconLocationTablet: value,
													iconPaddingRightTablet: 'inline' === value ? '0.5' : '',
													iconPaddingBottomTablet: 'above' === value ? '0.5' : '',
												} );
											} }
										/>

										{ 'inline' === iconLocationTablet &&
											<SelectControl
												label={ __( 'Icon Alignment', 'generateblocks' ) }
												value={ iconVerticalAlignmentTablet }
												options={ [
													{ label: __( 'Top', 'generateblocks' ), value: 'top' },
													{ label: __( 'Center', 'generateblocks' ), value: 'center' },
													{ label: __( 'Bottom', 'generateblocks' ), value: 'bottom' },
												] }
												onChange={ ( value ) => {
													setAttributes( {
														iconVerticalAlignmentTablet: value,
													} );
												} }
											/>
										}

										<DimensionsControl { ...this.props }
											device={ this.getDeviceType() }
											type={ 'padding' }
											label={ __( 'Padding', 'generateblocks' ) }
											attrTop={ 'iconPaddingTopTablet' }
											attrRight={ 'iconPaddingRightTablet' }
											attrBottom={ 'iconPaddingBottomTablet' }
											attrLeft={ 'iconPaddingLeftTablet' }
											attrUnit={ 'iconPaddingUnit' }
											attrSyncUnits={ 'iconPaddingSyncUnits' }
											defaults={ generateBlocksDefaults.headline }
										/>
									</Fragment>
								}

								<div className="components-gblocks-typography-control__header">
									<div className="components-gblocks-typography-control__label components-base-control__label">
										{ __( 'Icon Size', 'generateblocks' ) }
									</div>

									<div className="components-gblocks-control__units">
										<ButtonGroup className="components-gblocks-typography-control__units" aria-label={ __( 'Select Units', 'generateblocks' ) }>
											{ unitSizes.map( ( unit ) =>
												/* translators: %s: values associated with CSS syntax, 'Pixel', 'Em', 'Percentage' */
												<Tooltip text={ sprintf( __( '%s Units', 'generateblocks' ), unit.name ) } key={ unit.unitValue }>
													<Button
														key={ unit.unitValue }
														className={ 'components-gblocks-typography-control__units--' + unit.name }
														isSmall
														isPrimary={ iconSizeUnit === unit.unitValue }
														aria-pressed={ iconSizeUnit === unit.unitValue }
														/* translators: %s: values associated with CSS syntax, 'Pixel', 'Em', 'Percentage' */
														aria-label={ sprintf( __( '%s Units', 'generateblocks' ), unit.name ) }
														onClick={ () => setAttributes( { iconSizeUnit: unit.unitValue } ) }
													>
														{ unit.unitValue }
													</Button>
												</Tooltip>
											) }
										</ButtonGroup>
									</div>
								</div>

								<div className="components-base-control components-gblocks-typography-control__inputs">
									<TextControl
										type={ 'number' }
										value={ iconSizeTablet || 0 === iconSizeTablet ? iconSizeTablet : '' }
										step={ 'em' === iconSizeUnit ? .1 : 1 }
										placeholder={ iconSize || 0 === iconSize ? iconSize : '' }
										onChange={ ( value ) => {
											setAttributes( {
												iconSizeTablet: value,
											} );
										} }
										onBlur={ () => {
											setAttributes( {
												iconSizeTablet: parseFloat( iconSizeTablet ),
											} );
										} }
										onClick={ ( e ) => {
											// Make sure onBlur fires in Firefox.
											e.currentTarget.focus();
										} }
									/>

									<Button
										isSmall
										isSecondary
										className="components-gblocks-default-number"
										onClick={ () => {
											setAttributes( {
												iconSizeTablet: generateBlocksDefaults.headline.iconSizeTablet,
											} );
										} }
									>
										{ __( 'Reset', 'generateblocks' ) }
									</Button>
								</div>
							</Fragment>
						}

						{ 'Mobile' === this.getDeviceType() && !! icon &&
							<Fragment>
								{ ! removeText &&
									<Fragment>
										<SelectControl
											label={ __( 'Icon Location', 'generateblocks' ) }
											value={ iconLocationMobile }
											options={ [
												{ label: __( 'Inherit', 'generateblocks' ), value: '' },
												{ label: __( 'Inline', 'generateblocks' ), value: 'inline' },
												{ label: __( 'Above', 'generateblocks' ), value: 'above' },
											] }
											onChange={ ( value ) => {
												setAttributes( {
													iconLocationMobile: value,
													iconPaddingRightMobile: 'inline' === value ? '0.5' : '',
													iconPaddingBottomMobile: 'above' === value ? '0.5' : '',
												} );
											} }
										/>

										{ 'inline' === iconLocationMobile &&
											<SelectControl
												label={ __( 'Icon Alignment', 'generateblocks' ) }
												value={ iconVerticalAlignmentMobile }
												options={ [
													{ label: __( 'Top', 'generateblocks' ), value: 'top' },
													{ label: __( 'Center', 'generateblocks' ), value: 'center' },
													{ label: __( 'Bottom', 'generateblocks' ), value: 'bottom' },
												] }
												onChange={ ( value ) => {
													setAttributes( {
														iconVerticalAlignmentMobile: value,
													} );
												} }
											/>
										}

										<DimensionsControl { ...this.props }
											device={ this.getDeviceType() }
											type={ 'padding' }
											label={ __( 'Padding', 'generateblocks' ) }
											attrTop={ 'iconPaddingTopMobile' }
											attrRight={ 'iconPaddingRightMobile' }
											attrBottom={ 'iconPaddingBottomMobile' }
											attrLeft={ 'iconPaddingLeftMobile' }
											attrUnit={ 'iconPaddingUnit' }
											attrSyncUnits={ 'iconPaddingSyncUnits' }
											defaults={ generateBlocksDefaults.headline }
										/>
									</Fragment>
								}

								<div className="components-gblocks-typography-control__header">
									<div className="components-gblocks-typography-control__label components-base-control__label">
										{ __( 'Icon Size', 'generateblocks' ) }
									</div>

									<div className="components-gblocks-control__units">
										<ButtonGroup className="components-gblocks-typography-control__units" aria-label={ __( 'Select Units', 'generateblocks' ) }>
											{ unitSizes.map( ( unit ) =>
												/* translators: %s: values associated with CSS syntax, 'Pixel', 'Em', 'Percentage' */
												<Tooltip text={ sprintf( __( '%s Units', 'generateblocks' ), unit.name ) } key={ unit.unitValue }>
													<Button
														key={ unit.unitValue }
														className={ 'components-gblocks-typography-control__units--' + unit.name }
														isSmall
														isPrimary={ iconSizeUnit === unit.unitValue }
														aria-pressed={ iconSizeUnit === unit.unitValue }
														/* translators: %s: values associated with CSS syntax, 'Pixel', 'Em', 'Percentage' */
														aria-label={ sprintf( __( '%s Units', 'generateblocks' ), unit.name ) }
														onClick={ () => setAttributes( { iconSizeUnit: unit.unitValue } ) }
													>
														{ unit.unitValue }
													</Button>
												</Tooltip>
											) }
										</ButtonGroup>
									</div>
								</div>

								<div className="components-base-control components-gblocks-typography-control__inputs">
									<TextControl
										type={ 'number' }
										value={ iconSizeMobile || 0 === iconSizeMobile ? iconSizeMobile : '' }
										step={ 'em' === iconSizeUnit ? .1 : 1 }
										placeholder={ iconSizePlaceholderMobile }
										onChange={ ( value ) => {
											setAttributes( {
												iconSizeMobile: value,
											} );
										} }
										onBlur={ () => {
											setAttributes( {
												iconSizeMobile: parseFloat( iconSizeMobile ),
											} );
										} }
										onClick={ ( e ) => {
											// Make sure onBlur fires in Firefox.
											e.currentTarget.focus();
										} }
									/>

									<Button
										isSmall
										isSecondary
										className="components-gblocks-default-number"
										onClick={ () => {
											setAttributes( {
												iconSizeMobile: generateBlocksDefaults.headline.iconSizeMobile,
											} );
										} }
									>
										{ __( 'Reset', 'generateblocks' ) }
									</Button>
								</div>
							</Fragment>
						}

						{ applyFilters( 'generateblocks.editor.controls', '', 'headlineIcon', this.props, this.state ) }
					</PanelArea>

					<PanelArea { ...this.props }
						title={ __( 'General', 'generateblocks' ) }
						initialOpen={ false }
						icon={ getIcon( 'advanced' ) }
						className={ 'gblocks-panel-label' }
						id={ 'headlineGeneral' }
						state={ this.state }
						showPanel={ 'Desktop' === this.getDeviceType() || false }
					>
						{ applyFilters( 'generateblocks.editor.controls', '', 'headlineGeneral', this.props, this.state ) }
					</PanelArea>

					<PanelArea { ...this.props }
						title={ __( 'Documentation', 'generateblocks' ) }
						icon={ getIcon( 'documentation' ) }
						initialOpen={ false }
						className={ 'gblocks-panel-label' }
						id={ 'headlineDocumentation' }
						state={ this.state }
					>
						<p>{ __( 'Need help with this block?', 'generateblocks' ) }</p>
						<a href="https://docs.generateblocks.com/collection/headline/" target="_blank" rel="noreferrer noopener">{ __( 'Visit our documentation', 'generateblocks' ) }</a>

						{ applyFilters( 'generateblocks.editor.controls', '', 'headlineDocumentation', this.props, this.state ) }
					</PanelArea>
				</InspectorControls>

				<InspectorAdvancedControls>
					<TextControl
						label={ __( 'HTML Anchor' ) }
						help={ __( 'Anchors lets you link directly to a section on a page.', 'generateblocks' ) }
						value={ anchor || '' }
						onChange={ ( nextValue ) => {
							nextValue = nextValue.replace( ANCHOR_REGEX, '-' );
							setAttributes( {
								anchor: nextValue,
							} );
						} } />
				</InspectorAdvancedControls>

				<DesktopCSS { ...this.props } />

				{ ( this.props.deviceType && ( 'Tablet' === this.props.deviceType || 'Mobile' === this.props.deviceType ) ) &&
					<TabletCSS { ...this.props } />
				}

				{ this.props.deviceType && 'Mobile' === this.props.deviceType &&
					<MobileCSS { ...this.props } />
				}

				{ fontFamily && googleFont &&
					<link
						rel="stylesheet"
						href={ 'https://fonts.googleapis.com/css?family=' + fontFamily.replace( / /g, '+' ) + googleFontsAttr }
					/>
				}

				<Text
					attributes={ attributes }
					tagName={ element }
					id={ anchor }
					className={ classnames( {
						'gb-headline': true,
						[ `gb-headline-${ uniqueId }` ]: true,
						'gb-headline-wrapper': ! icon,
						[ className ]: undefined !== className,
					} ) }
				>
					{ hasIcon &&
						<Fragment>
							<span
								className="gb-icon"
								aria-label={ !! removeText && !! ariaLabel ? ariaLabel : undefined }
								dangerouslySetInnerHTML={ { __html: sanitizeSVG( icon ) } }
							/>

							{ ! removeText &&
								<span className="gb-headline-wrapper">
									<RichText
										tagName="span"
										value={ content }
										onChange={ ( value ) => setAttributes( { content: value } ) }
										placeholder={ __( 'Write text...', 'generateblocks' ) }
										keepPlaceholderOnFocus={ true }
									/>
								</span>
							}
						</Fragment>
					}

					{ ! hasIcon && ! removeText &&
						<RichText
							tagName="span"
							value={ content }
							onChange={ ( value ) => setAttributes( { content: value } ) }
							placeholder={ __( 'Write text...', 'generateblocks' ) }
							keepPlaceholderOnFocus={ true }
						/>
					}
				</Text>
			</Fragment>
		);
	}
}

export default compose( [
	withDispatch( ( dispatch ) => ( {
		setDeviceType( type ) {
			const {
				__experimentalSetPreviewDeviceType: setPreviewDeviceType,
			} = dispatch( 'core/edit-post' );

			if ( ! setPreviewDeviceType ) {
				return;
			}

			setPreviewDeviceType( type );
		},
	} ) ),
	withSelect( ( select ) => {
		const {
			__experimentalGetPreviewDeviceType: getPreviewDeviceType,
		} = select( 'core/edit-post' );

		if ( ! getPreviewDeviceType ) {
			return {
				deviceType: null,
			};
		}

		return {
			deviceType: getPreviewDeviceType(),
		};
	} ),
] )( GenerateBlockHeadline );
