/**
 * Block: Headline
 */

import classnames from 'classnames';
import ColorPicker from '../../components/color-picker';
import hexToRGBA from '../../components/color-picker/hex-to-rgba';
import IconPicker from '../../components/icon-picker';
import TypographyControls from '../../components/typography';
import DimensionsControl from '../../components/dimensions/';
import ResponsiveTabs from '../../components/responsive-tabs';
import getIcon from '../../utils/get-icon';
import buildCSS from '../../utils/build-css';
import shorthandCSS from '../../utils/shorthand-css';
import valueWithUnit from '../../utils/value-with-unit';
import flexboxAlignment from '../../utils/flexbox-alignment';
import './markformat';

const { __ } = wp.i18n; // Import __() from wp.i18n
const {
	TextControl,
	Toolbar,
	PanelBody,
	RangeControl,
	SelectControl,
	BaseControl,
	DropdownMenu,
	ToggleControl,
	Tooltip,
	Button,
} = wp.components;

const {
	Fragment,
	Component
} = wp.element;

const {
	InspectorControls,
	InspectorAdvancedControls,
	RichText,
	BlockControls,
	AlignmentToolbar,
} = wp.blockEditor;

const ELEMENT_ID_REGEX = /[\s#]/g;
const gbHeadlineIds = [];

class GenerateBlockHeadline extends Component {
	constructor() {
		super( ...arguments );

		this.state = {
			selectedDevice: 'desktop',
        };
	}

	componentDidMount() {
		let id = this.props.clientId.substr( 2, 9 ).replace( '-', '' );

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
	}

	render() {
		const {
			attributes,
			setAttributes,
			clientId,
		} = this.props;

		const {
            selectedDevice,
        } = this.state;

		const {
			uniqueId,
			elementId,
			cssClasses,
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
			showAdvancedTypography,
			fontFamily,
			fontFamilyFallback,
			googleFont,
			fontWeight,
			fontSize,
			fontSizeTablet,
			fontSizeMobile,
			fontSizeUnit,
			textTransform,
			lineHeight,
			lineHeightTablet,
			lineHeightMobile,
			lineHeightUnit,
			letterSpacing,
			letterSpacingTablet,
			letterSpacingMobile,
			marginTop,
			marginRight,
			marginBottom,
			marginLeft,
			marginSyncUnits,
			marginTopTablet,
			marginRightTablet,
			marginLeftTablet,
			marginBottomTablet,
			marginTopMobile,
			marginRightMobile,
			marginBottomMobile,
			marginLeftMobile,
			marginUnit,
			paddingTop,
			paddingRight,
			paddingBottom,
			paddingLeft,
			paddingTopTablet,
			paddingRightTablet,
			paddingBottomTablet,
			paddingLeftTablet,
			paddingTopMobile,
			paddingRightMobile,
			paddingBottomMobile,
			paddingLeftMobile,
			paddingUnit,
			paddingSyncUnits,
			borderSizeTop,
			borderSizeRight,
			borderSizeBottom,
			borderSizeLeft,
			borderSizeSyncUnits,
			borderSizeTopTablet,
			borderSizeRightTablet,
			borderSizeBottomTablet,
			borderSizeLeftTablet,
			borderSizeTopMobile,
			borderSizeRightMobile,
			borderSizeBottomMobile,
			borderSizeLeftMobile,
			icon,
			iconColor,
			iconColorOpacity,
			customIcon,
			iconLocation,
			iconLocationTablet,
			iconLocationMobile,
			iconVerticalAlignment,
			iconVerticalAlignmentTablet,
			iconVerticalAlignmentMobile,
			iconPaddingTop,
			iconPaddingRight,
			iconPaddingBottom,
			iconPaddingLeft,
			iconPaddingTopTablet,
			iconPaddingRightTablet,
			iconPaddingBottomTablet,
			iconPaddingLeftTablet,
			iconPaddingTopMobile,
			iconPaddingRightMobile,
			iconPaddingBottomMobile,
			iconPaddingLeftMobile,
			iconPaddingUnit,
			iconPaddingSyncUnits,
			iconSize,
			iconSizeTablet,
			iconSizeMobile,
			inlineWidth,
			inlineWidthTablet,
			inlineWidthMobile,
			removeText,
			ariaLabel,
		} = attributes;

		let fontFamilyFallbackValue = '',
			marginBottomValue = '';

		if ( fontFamily && fontFamilyFallback ) {
			fontFamilyFallbackValue = ', ' + fontFamilyFallback;
		}

		if ( marginBottom ) {
			marginBottomValue = marginBottom + marginUnit;
		} else if ( typeof generateBlocksStyling.headline !== 'undefined' ) {
			if ( 'p' === element ) {
				marginBottomValue = generateBlocksStyling.headline.paragraphMargin;
			} else if ( 'h1' === element ) {
				marginBottomValue = generateBlocksStyling.headline.h1Margin;
			} else if ( 'h2' === element ) {
				marginBottomValue = generateBlocksStyling.headline.h2Margin;
			} else if ( 'h3' === element ) {
				marginBottomValue = generateBlocksStyling.headline.h3Margin;
			} else if ( 'h4' === element ) {
				marginBottomValue = generateBlocksStyling.headline.h4Margin;
			} else if ( 'h5' === element ) {
				marginBottomValue = generateBlocksStyling.headline.h5Margin;
			} else if ( 'h6' === element ) {
				marginBottomValue = generateBlocksStyling.headline.h6Margin;
			}
		}

		let cssObj = [];

		cssObj[ '.editor-styles-wrapper .gb-headline-' + uniqueId ] = [ {
			'font-family' : fontFamily + fontFamilyFallbackValue,
			'font-weight' : fontWeight,
			'text-transform' : textTransform,
			'text-align' : alignment,
			'font-size' : valueWithUnit( fontSize, fontSizeUnit ),
			'line-height': valueWithUnit( lineHeight, lineHeightUnit ),
			'letter-spacing' : valueWithUnit( letterSpacing, 'em' ),
		} ];

		cssObj[ '.gb-headline-wrapper-' + uniqueId ] = [ {
			'flex-direction': icon && 'above' === iconLocation ? 'column' : false,
			'justify-content': flexboxAlignment( alignment ),
			'text-align': alignment,
			'align-items': 'inline' === iconLocation ? iconVerticalAlignment : flexboxAlignment( alignment ),
		} ];

		let headlineStyleSelector = '.editor-styles-wrapper .gb-headline-' + uniqueId;

		if ( icon ) {
			headlineStyleSelector = '.gb-headline-wrapper-' + uniqueId;
		}

		cssObj[ headlineStyleSelector ].push( {
			'background-color': hexToRGBA( backgroundColor, backgroundColorOpacity ),
			'color': textColor,
			'display': inlineWidth ? 'inline-flex' : false,
			'margin': shorthandCSS( marginTop, marginRight, marginBottomValue, marginLeft, marginUnit ) + ' !important',
			'margin-bottom': marginBottomValue + ' !important', // The unit changes depending on the element if no value exists.
			'padding': shorthandCSS( paddingTop, paddingRight, paddingBottom, paddingLeft, paddingUnit ),
		} );

		if ( borderSizeTop || borderSizeRight || borderSizeBottom || borderSizeLeft ) {
			cssObj[ headlineStyleSelector ].push( {
				'border-width' : shorthandCSS( borderSizeTop, borderSizeRight, borderSizeBottom, borderSizeLeft, 'px' ),
				'border-style' : 'solid',
				'border-color' : hexToRGBA( borderColor, borderColorOpacity )
			} );
		}

		cssObj[ '.editor-styles-wrapper .gb-headline-' + uniqueId + ' a' ] = [ {
			'color' : linkColor,
		} ];

		cssObj[ '.gb-headline-wrapper-' + uniqueId + ' .gb-icon' ] = [ {
			'padding': shorthandCSS( iconPaddingTop, iconPaddingRight, iconPaddingBottom, iconPaddingLeft, iconPaddingUnit ),
			'align-self': icon && 'above' === iconLocation ? flexboxAlignment( alignment ) : false,
			'color': hexToRGBA( iconColor, iconColorOpacity ),
			'font-size': valueWithUnit( fontSize, fontSizeUnit ),
			'display': icon && 'above' === iconLocation ? 'unset' : false
		} ];

		cssObj[ '.gb-headline-wrapper-' + uniqueId + ' .gb-icon svg' ] = [ {
			'width': valueWithUnit( iconSize, 'em' ),
			'height': valueWithUnit( iconSize, 'em' )
		} ];

		cssObj[ '.gb-headline-` + uniqueId + ` .gb-highlight' ] = [ {
			'color': highlightTextColor
		} ];

		const sanitizeSVG = ( svg ) => {
			return DOMPurify.sanitize( svg, { USE_PROFILES: { svg: true, svgFilters: true } } );
		}
		cssObj[ '#block-' + clientId ] = [ {
			'display': inlineWidth ? 'inline-flex' : false
		} ];

		const css = buildCSS( cssObj );
		const googleFontsAttr = ':100,100italic,200,200italic,300,300italic,400,400italic,500,500italic,600,600italic,700,700italic,800,800italic,900,900italic';

		return (
			<Fragment>

				<BlockControls>
					<Toolbar>
						<DropdownMenu
							icon={ getIcon( 'paragraph' ) }
							label={ __( 'Element' ) }
							controls={ [
								{
									title: 'paragraph',
									onClick: () => setAttributes( { element: 'p' } ),
								},
								{
									title: 'h1',
									onClick: () => setAttributes( { element: 'h1' } ),
								},
								{
									title: 'h2',
									onClick: () => setAttributes( { element: 'h2' } ),
								},
								{
									title: 'h3',
									onClick: () => setAttributes( { element: 'h3' } ),
								},
								{
									title: 'h4',
									onClick: () => setAttributes( { element: 'h4' } ),
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
						selectedDevice={ selectedDevice }
						onClick={ ( device ) => {
							this.setState( {
								selectedDevice: device,
							} );
						} }
					/>

					<PanelBody
						title={ __( 'Typography', 'generateblocks' ) }
						initialOpen={ true }
						icon={ getIcon( 'typography' ) }
						className={ 'gblocks-panel-label' }
						>
							{ 'desktop' === selectedDevice && (
								<Fragment>
									<SelectControl
										label={ __( 'Element', 'generateblocks' ) }
										value={ element }
										options={ [
											{ label: 'paragraph', value: 'p' },
											{ label: 'h1', value: 'h1' },
											{ label: 'h2', value: 'h2' },
											{ label: 'h3', value: 'h3' },
											{ label: 'h4', value: 'h4' },
											{ label: 'h5', value: 'h5' },
											{ label: 'h6', value: 'h6' },
										] }
										onChange={ ( element ) => { setAttributes( { element } ) } }
									/>

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
										defaultFontSize={ generateBlocksDefaults.headline.fontSize }
										defaultFontSizeUnit={ generateBlocksDefaults.headline.fontSizeUnit }
										defaultLineHeight={ generateBlocksDefaults.headline.lineHeight }
										defaultLineHeightUnit={ generateBlocksDefaults.headline.lineHeightUnit }
										defaultLetterSpacing={ generateBlocksDefaults.headline.letterSpacing }
									/>
								</Fragment>
							) }

							{ 'tablet' === selectedDevice && (
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

							{ 'mobile' === selectedDevice && (
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
					</PanelBody>

					<PanelBody
						title={ __( 'Spacing', 'generateblocks' ) }
						initialOpen={ false }
						icon={ getIcon( 'spacing' ) }
						className={ 'gblocks-panel-label' }
						>
							{ 'desktop' === selectedDevice && (
								<Fragment>
									<ToggleControl
										label={ __( 'Inline Width', 'generateblocks' ) }
										checked={ !! inlineWidth }
										onChange={ ( value ) => {
											setAttributes( {
												inlineWidth: value
											} );
										} }
									/>

									<DimensionsControl { ...this.props }
										type={ 'padding' }
										label={ __( 'Padding', 'generateblocks' ) }
										attrTop={ 'paddingTop' }
										attrRight={ 'paddingRight' }
										attrBottom={ 'paddingBottom' }
										attrLeft={ 'paddingLeft' }
										attrUnit={ 'paddingUnit' }
										attrSyncUnits={ 'paddingSyncUnits' }
									/>

									<DimensionsControl { ...this.props }
										type={ 'margin' }
										label={ __( 'Margin', 'generateblocks' ) }
										attrTop={ 'marginTop' }
										attrRight={ 'marginRight' }
										attrBottom={ 'marginBottom' }
										attrLeft={ 'marginLeft' }
										attrUnit={ 'marginUnit' }
										attrSyncUnits={ 'marginSyncUnits' }
									/>

									<DimensionsControl { ...this.props }
										type={ 'padding' }
										label={ __( 'Border Size', 'generateblocks' ) }
										attrTop={ 'borderSizeTop' }
										attrRight={ 'borderSizeRight' }
										attrBottom={ 'borderSizeBottom' }
										attrLeft={ 'borderSizeLeft' }
										attrSyncUnits={ 'borderSizeSyncUnits' }
										displayUnit={ 'px' }
									/>
								</Fragment>
							) }

							{ 'tablet' === selectedDevice && (
								<Fragment>
									<ToggleControl
										label={ __( 'Inline Width', 'generateblocks' ) }
										checked={ !! inlineWidthTablet }
										onChange={ ( value ) => {
											setAttributes( {
												inlineWidthTablet: value
											} );
										} }
									/>

									<DimensionsControl { ...this.props }
										type={ 'padding' }
										label={ __( 'Padding', 'generateblocks' ) }
										attrTop={ 'paddingTopTablet' }
										attrRight={ 'paddingRightTablet' }
										attrBottom={ 'paddingBottomTablet' }
										attrLeft={ 'paddingLeftTablet' }
										attrUnit={ 'paddingUnit' }
										attrSyncUnits={ 'paddingSyncUnits' }
									/>

									<DimensionsControl { ...this.props }
										type={ 'margin' }
										label={ __( 'Margin', 'generateblocks' ) }
										attrTop={ 'marginTopTablet' }
										attrRight={ 'marginRightTablet' }
										attrBottom={ 'marginBottomTablet' }
										attrLeft={ 'marginLeftTablet' }
										attrUnit={ 'marginUnit' }
										attrSyncUnits={ 'marginSyncUnits' }
									/>

									<DimensionsControl { ...this.props }
										type={ 'padding' }
										label={ __( 'Border Size', 'generateblocks' ) }
										attrTop={ 'borderSizeTopTablet' }
										attrRight={ 'borderSizeRightTablet' }
										attrBottom={ 'borderSizeBottomTablet' }
										attrLeft={ 'borderSizeLeftTablet' }
										attrSyncUnits={ 'borderSizeSyncUnits' }
										displayUnit={ 'px' }
									/>
								</Fragment>
							) }

							{ 'mobile' === selectedDevice && (
								<Fragment>
									<ToggleControl
										label={ __( 'Inline Width', 'generateblocks' ) }
										checked={ !! inlineWidthMobile }
										onChange={ ( value ) => {
											setAttributes( {
												inlineWidthMobile: value
											} );
										} }
									/>

									<DimensionsControl { ...this.props }
										type={ 'padding' }
										label={ __( 'Padding', 'generateblocks' ) }
										attrTop={ 'paddingTopMobile' }
										attrRight={ 'paddingRightMobile' }
										attrBottom={ 'paddingBottomMobile' }
										attrLeft={ 'paddingLeftMobile' }
										attrUnit={ 'paddingUnit' }
										attrSyncUnits={ 'paddingSyncUnits' }
									/>

									<DimensionsControl { ...this.props }
										type={ 'margin' }
										label={ __( 'Margin', 'generateblocks' ) }
										attrTop={ 'marginTopMobile' }
										attrRight={ 'marginRightMobile' }
										attrBottom={ 'marginBottomMobile' }
										attrLeft={ 'marginLeftMobile' }
										attrUnit={ 'marginUnit' }
										attrSyncUnits={ 'marginSyncUnits' }
									/>

									<DimensionsControl { ...this.props }
										type={ 'padding' }
										label={ __( 'Border Size', 'generateblocks' ) }
										attrTop={ 'borderSizeTopMobile' }
										attrRight={ 'borderSizeRightMobile' }
										attrBottom={ 'borderSizeBottomMobile' }
										attrLeft={ 'borderSizeLeftMobile' }
										attrSyncUnits={ 'borderSizeSyncUnits' }
										displayUnit={ 'px' }
									/>
								</Fragment>
							) }
					</PanelBody>

					{ 'desktop' === selectedDevice &&
						<PanelBody
							title={ __( 'Colors', 'generateblocks' ) }
							initialOpen={ false }
							icon={ getIcon( 'colors' ) }
							className={ 'gblocks-panel-label' }
							>
							<ColorPicker
								label={ __( 'Background Color', 'generateblocks' ) }
								value={ backgroundColor }
								alpha={ true }
								valueOpacity={ backgroundColorOpacity }
								attrOpacity={ 'backgroundColorOpacity' }
								onChange={ ( value ) =>
									setAttributes( {
										backgroundColor: value
									} )
								}
								onOpacityChange={ ( value ) =>
									setAttributes( {
										backgroundColorOpacity: value
									} )
								}
							/>

							<ColorPicker
								label={ __( 'Text Color', 'generateblocks' ) }
								value={ textColor }
								alpha={ false }
								onChange={ ( value ) =>
									setAttributes( {
										textColor: value
									} )
								}
							/>

							<ColorPicker
								label={ __( 'Link Color', 'generateblocks' ) }
								value={ linkColor }
								alpha={ false }
								onChange={ ( value ) =>
									setAttributes( {
										linkColor: value
									} )
								}
							/>

							<ColorPicker
								label={ __( 'Link Color Hover', 'generateblocks' ) }
								value={ linkColorHover }
								alpha={ false }
								onChange={ ( value ) =>
									setAttributes( {
										linkColorHover: value
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
										borderColor: value
									} )
								}
								onOpacityChange={ ( value ) =>
									setAttributes( {
										borderColorOpacity: value
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
											iconColor: value
										} )
									}
									onOpacityChange={ ( value ) =>
										setAttributes( {
											iconColorOpacity: value
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
										highlightTextColor: value
									} )
								}
							/>
						</PanelBody>
					}

					<PanelBody
						title={ __( 'Icon', 'generateblocks' ) }
						initialOpen={ false }
						icon={ getIcon( 'icons' ) }
						className={ 'gblocks-panel-label' }
						>

						{ 'desktop' === selectedDevice &&
							<IconPicker { ...this.props }
								attrIcon={ 'icon' }
								attrRemoveText={ 'removeText' }
								attrAriaLabel={ 'ariaLabel' }
							/>
						}

						{ 'desktop' === selectedDevice && (
							<Fragment>
								{ ! removeText &&
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
								}

								{ 'inline' === iconLocation && ! removeText &&
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
												iconVerticalAlignment: value
											} );
										} }
									/>
								}

								<DimensionsControl { ...this.props }
									type={ 'padding' }
									label={ __( 'Padding', 'generateblocks' ) }
									attrTop={ 'iconPaddingTop' }
									attrRight={ 'iconPaddingRight' }
									attrBottom={ 'iconPaddingBottom' }
									attrLeft={ 'iconPaddingLeft' }
									attrUnit={ 'iconPaddingUnit' }
									attrSyncUnits={ 'iconPaddingSyncUnits' }
								/>

								<RangeControl
									label={ __( 'Icon Size', 'generateblocks' ) }
									value={ iconSize ? iconSize : '' }
									onChange={ ( value ) => setAttributes( {
										iconSize: value
									} ) }
									min={ .1 }
									max={ 15 }
									step={ .1 }
									initialPosition={ generateBlocksDefaults.headline.iconSize }
									allowReset={ true }
								/>
							</Fragment>
						) }

						{ 'tablet' === selectedDevice && (
							<Fragment>
								{ ! removeText &&
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
								}

								{ 'inline' === iconLocationTablet && ! removeText &&
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
												iconVerticalAlignmentTablet: value
											} );
										} }
									/>
								}

								<DimensionsControl { ...this.props }
									type={ 'padding' }
									label={ __( 'Padding', 'generateblocks' ) }
									attrTop={ 'iconPaddingTopTablet' }
									attrRight={ 'iconPaddingRightTablet' }
									attrBottom={ 'iconPaddingBottomTablet' }
									attrLeft={ 'iconPaddingLeftTablet' }
									attrUnit={ 'iconPaddingUnit' }
									attrSyncUnits={ 'iconPaddingSyncUnits' }
								/>

								<RangeControl
									label={ __( 'Icon Size', 'generateblocks' ) }
									value={ iconSizeTablet || '' }
									onChange={ ( value ) => setAttributes( {
										iconSizeTablet: value
									} ) }
									min={ .1 }
									max={ 15 }
									step={ .1 }
									initialPosition={ generateBlocksDefaults.headline.iconSizeTablet }
									allowReset={ true }
								/>
							</Fragment>
						) }

						{ 'mobile' === selectedDevice && (
							<Fragment>
								{ ! removeText &&
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
								}

								{ 'inline' === iconLocationMobile && ! removeText &&
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
												iconVerticalAlignmentMobile: value
											} );
										} }
									/>
								}

								<DimensionsControl { ...this.props }
									type={ 'padding' }
									label={ __( 'Padding', 'generateblocks' ) }
									attrTop={ 'iconPaddingTopMobile' }
									attrRight={ 'iconPaddingRightMobile' }
									attrBottom={ 'iconPaddingBottomMobile' }
									attrLeft={ 'iconPaddingLeftMobile' }
									attrUnit={ 'iconPaddingUnit' }
									attrSyncUnits={ 'iconPaddingSyncUnits' }
								/>

								<RangeControl
									label={ __( 'Icon Size', 'generateblocks' ) }
									value={ iconSizeMobile ? iconSizeMobile : '' }
									onChange={ ( value ) => setAttributes( {
										iconSizeMobile: value
									} ) }
									min={ .1 }
									max={ 15 }
									step={ .1 }
									initialPosition={ generateBlocksDefaults.headline.iconSizeMobile }
									allowReset={ true }
								/>
							</Fragment>
						) }
					</PanelBody>

					{ 'desktop' === selectedDevice &&
						<PanelBody
							title={ __( 'Advanced', 'generateblocks' ) }
							initialOpen={ false }
							icon={ getIcon( 'advanced' ) }
							className={ 'gblocks-panel-label' }
						>
							<TextControl
								label={ __( 'Element ID', 'generateblocks' ) }
								value={ elementId }
								onChange={ ( elementId ) => {
									elementId = elementId.replace( ELEMENT_ID_REGEX, '-' );
									setAttributes( { elementId } );
								} }
							/>

							<TextControl
								label={ __( 'CSS Classes', 'generateblocks' ) }
								value={ cssClasses }
								onChange={ ( cssClasses ) => { setAttributes( { cssClasses } ) } }
							/>
						</PanelBody>
					}

					<PanelBody
						title={ __( 'Documentation', 'generateblocks' ) }
						icon={ getIcon( 'documentation' ) }
						initialOpen={ false }
						className={ 'gblocks-panel-label' }
					>
						<p>{ __( 'Need help with this block?', 'generateblocks' ) }</p>
						<a href="https://docs.generateblocks.com/collection/headline/" target="_blank" rel="noreferrer noopener">{ __( 'Visit our documentation', 'generateblocks' ) }</a>
					</PanelBody>
				</InspectorControls>

				<style>{ css }</style>

				{ fontFamily && googleFont &&
					<link
						rel="stylesheet"
						href={ `https://fonts.googleapis.com/css?family=` + fontFamily.replace( / /g, '+' ) + googleFontsAttr }
					/>
				}

				{ icon ? (
					<div
						className={ classnames( {
						'gb-headline-wrapper': true,
						[`gb-headline-wrapper-${ uniqueId }`]: true,
						} ) }
					>
						{ icon &&
							<span
								className="gb-icon"
								aria-label={ !! removeText && !! ariaLabel ? ariaLabel : undefined }
								dangerouslySetInnerHTML={ { __html: sanitizeSVG( icon ) } }
							/>
						}

						{ ! removeText &&
							<RichText
								allowedFormats={ [ 'core/bold', 'core/italic', 'core/link', 'core/underline', 'generateblocks/mark' ] }
								tagName={ element }
								value={ content }
								onChange={ ( value ) => setAttributes( { content: value } ) }
								id={ !! elementId ? elementId : undefined }
								className={ classnames( {
									'gb-headline': true,
									[`gb-headline-${ uniqueId }`]: true,
									[`${ cssClasses }`]: '' !== cssClasses
								} ) }
								placeholder={ __( 'Write headline…', 'generateblocks' ) }
								keepPlaceholderOnFocus={ true }
							/>
						}
					</div>
				) : (
					<RichText
						allowedFormats={ [ 'core/bold', 'core/italic', 'core/link', 'core/underline', 'generateblocks/mark' ] }
						tagName={ element }
						value={ content }
						onChange={ ( value ) => setAttributes( { content: value } ) }
						id={ !! elementId ? elementId : undefined }
						className={ classnames( {
							'gb-headline': true,
							[`gb-headline-${ uniqueId }`]: true,
							[`${ cssClasses }`]: '' !== cssClasses
						} ) }
						placeholder={ __( 'Write headline…', 'generateblocks' ) }
						keepPlaceholderOnFocus={ true }
					/>
				) }
			</Fragment>
		);
	}
}

export default ( GenerateBlockHeadline );
