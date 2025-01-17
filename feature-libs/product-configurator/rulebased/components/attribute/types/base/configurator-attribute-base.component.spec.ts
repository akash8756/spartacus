import { Configurator } from '../../../../core/model/configurator.model';
import { ConfiguratorAttributeBaseComponent } from './configurator-attribute-base.component';
import { ConfiguratorTestUtils } from '../../../../testing/configurator-test-utils';

const attributeCode = 1;
const currentAttribute: Configurator.Attribute = {
  name: 'attributeId',
  attrCode: attributeCode,
  uiType: Configurator.UiType.RADIOBUTTON,
};

const attributeIncomplete: Configurator.Attribute = { name: 'name' };

describe('ConfigUIKeyGeneratorService', () => {
  let classUnderTest: ConfiguratorAttributeBaseComponent;

  beforeEach(() => {
    classUnderTest = new ConfiguratorAttributeBaseComponent();
  });

  it('should generate value key', () => {
    expect(
      classUnderTest.createValueUiKey('prefix', 'attributeId', 'valueId')
    ).toBe('cx-configurator--prefix--attributeId--valueId');
  });

  it('should generate attribute key', () => {
    expect(classUnderTest.createAttributeUiKey('prefix', 'attributeId')).toBe(
      'cx-configurator--prefix--attributeId'
    );
  });

  describe('createAriaLabelledBy', () => {
    it('should return only attribute id for aria-labelledby', () => {
      expect(
        classUnderTest.createAriaLabelledBy('prefix', 'attributeId')
      ).toEqual('cx-configurator--label--attributeId');
    });

    it("should return only attribute id for aria-labelledby because value id is 'undefined'", () => {
      expect(
        classUnderTest.createAriaLabelledBy('prefix', 'attributeId', undefined)
      ).toEqual('cx-configurator--label--attributeId');
    });

    it('should return attribute id, value id  and without quantity for aria-labelledby', () => {
      expect(
        classUnderTest.createAriaLabelledBy('prefix', 'attributeId', 'valueId')
      ).toEqual(
        'cx-configurator--label--attributeId cx-configurator--prefix--attributeId--valueId cx-configurator--price--optionsPriceValue--attributeId--valueId'
      );
    });

    it('should return attribute id, value id  and with undefined quantity for aria-labelledby', () => {
      expect(
        classUnderTest.createAriaLabelledBy(
          'prefix',
          'attributeId',
          'valueId',
          undefined
        )
      ).toEqual(
        'cx-configurator--label--attributeId cx-configurator--prefix--attributeId--valueId cx-configurator--price--optionsPriceValue--attributeId--valueId'
      );
    });

    it("should return attribute id, value id  and with quantity equals 'true' for aria-labelledby", () => {
      expect(
        classUnderTest.createAriaLabelledBy(
          'prefix',
          'attributeId',
          'valueId',
          true
        )
      ).toEqual(
        'cx-configurator--label--attributeId cx-configurator--prefix--attributeId--valueId cx-configurator--price--optionsPriceValue--attributeId--valueId'
      );
    });

    it("should return attribute id, value id  and with quantity equals 'false' for aria-labelledby", () => {
      expect(
        classUnderTest.createAriaLabelledBy(
          'prefix',
          'attributeId',
          'valueId',
          false
        )
      ).toEqual(
        'cx-configurator--label--attributeId cx-configurator--prefix--attributeId--valueId cx-configurator--option--price--attributeId--valueId'
      );
    });
  });

  describe('createAttributeIdForConfigurator', () => {
    it('should generate attribute id for configurator', () => {
      expect(
        classUnderTest.createAttributeIdForConfigurator(currentAttribute)
      ).toBe('cx-configurator--radioGroup--attributeId');
    });

    it('should generate value id for configurator', () => {
      expect(
        classUnderTest.createAttributeValueIdForConfigurator(
          currentAttribute,
          'valueId'
        )
      ).toBe('cx-configurator--radioGroup--attributeId--valueId');
    });
  });

  describe('getImage', () => {
    const image: Configurator.Image = { url: 'url' };
    const value: Configurator.Value = { valueCode: 'val', images: [image] };

    it('should return first image if present', () => {
      expect(classUnderTest.getImage(value)).toBe(image);
    });

    it('should return undefined in case no images present on value', () => {
      value.images = undefined;
      expect(classUnderTest.getImage(value)).toBeUndefined();
    });

    it('should return undefined in case empty image array present on value', () => {
      value.images = [];
      expect(classUnderTest.getImage(value)).toBeUndefined();
    });
  });

  it('should generate focus id for attribute value', () => {
    expect(classUnderTest.createFocusId('attrCode', 'valueCode')).toBe(
      'attrCode--valueCode--focus'
    );
  });

  describe('getUiType', () => {
    it('should return ui type from attribute if set on attribute level', () => {
      expect(classUnderTest['getUiType'](currentAttribute)).toBe(
        Configurator.UiType.RADIOBUTTON
      );
    });
    it('should return ui type "not implemented" if not available on attribute', () => {
      expect(classUnderTest['getUiType'](attributeIncomplete)).toBe(
        Configurator.UiType.NOT_IMPLEMENTED
      );
    });
  });

  describe('getAttributeCode', () => {
    it('should return code from attribute if available', () => {
      expect(classUnderTest['getAttributeCode'](currentAttribute)).toBe(
        attributeCode
      );
    });
    it('should throw exception if no code available', () => {
      expect(() =>
        classUnderTest['getAttributeCode'](attributeIncomplete)
      ).toThrow();
    });
  });

  describe('isWithAdditionalValues', () => {
    it('should know that DROPDOWN does not allow additional values', () => {
      currentAttribute.uiType = Configurator.UiType.DROPDOWN;
      expect(classUnderTest['isWithAdditionalValues'](currentAttribute)).toBe(
        false
      );
    });

    it('should know that DROPDOWN_ADDITIONAL_INPUT allows additional values', () => {
      currentAttribute.uiType = Configurator.UiType.DROPDOWN_ADDITIONAL_INPUT;
      expect(classUnderTest['isWithAdditionalValues'](currentAttribute)).toBe(
        true
      );
    });

    it('should know that RADIOBUTTON_ADDITIONAL_INPUT allows additional values', () => {
      currentAttribute.uiType =
        Configurator.UiType.RADIOBUTTON_ADDITIONAL_INPUT;
      expect(classUnderTest['isWithAdditionalValues'](currentAttribute)).toBe(
        true
      );
    });
  });

  describe('getLabel', () => {
    it('should return empty string', () => {
      expect(classUnderTest.getLabel(false, undefined, undefined)).toEqual('');
    });

    it('should return label without technical name', () => {
      const label = 'label';
      const techName = 'techName';
      expect(classUnderTest.getLabel(false, label, techName)).toEqual(label);
    });

    it('should return label without technical name despite expert mode is set to true', () => {
      const label = 'label';
      const techName = undefined;
      expect(classUnderTest.getLabel(true, label, techName)).toEqual(label);
    });

    it('should return label with technical name because expert mode is set to true', () => {
      const label = 'label';
      const techName = 'techName';
      const techLabel = label + ' / [' + techName + ']';
      expect(classUnderTest.getLabel(true, label, techName)).toEqual(techLabel);
    });

    it('should return label with positive price', () => {
      const label = 'label';
      const techName = undefined;
      const value = ConfiguratorTestUtils.createValue('valueCode', 3.2);
      expect(classUnderTest.getLabel(false, label, techName, value)).toEqual(
        label + ' [+' + value.valuePrice?.formattedValue + ']'
      );
    });

    it('should return label with zero price', () => {
      const label = 'label';
      const techName = undefined;
      const value = ConfiguratorTestUtils.createValue('valueCode', 0);
      expect(classUnderTest.getLabel(false, label, techName, value)).toEqual(
        label
      );
    });

    it('should return label with negative price', () => {
      const label = 'label';
      const techName = undefined;
      const value = ConfiguratorTestUtils.createValue('valueCode', -3.2);
      expect(classUnderTest.getLabel(false, label, techName, value)).toEqual(
        label + ' [' + value.valuePrice?.formattedValue + ']'
      );
    });
  });

  describe('getValuePrice', () => {
    it('should return empty string because value is undefined', () => {
      expect(classUnderTest['getValuePrice'](undefined)).toEqual('');
    });

    it('should return empty string because price is undefined', () => {
      const value = ConfiguratorTestUtils.createValue('valueCode', undefined);
      expect(classUnderTest['getValuePrice'](value)).toEqual('');
    });

    it('should return empty string because price is zero', () => {
      const value = ConfiguratorTestUtils.createValue('valueCode', 0);
      expect(classUnderTest['getValuePrice'](value)).toEqual('');
    });

    it('should return title that contains negative price', () => {
      const value = ConfiguratorTestUtils.createValue('valueCode', -100);
      expect(classUnderTest['getValuePrice'](value)).toEqual(
        ' [' + value.valuePrice?.formattedValue + ']'
      );
    });

    it('should return title that contains positive price', () => {
      const value = ConfiguratorTestUtils.createValue('valueCode', 10);
      expect(classUnderTest['getValuePrice'](value)).toEqual(
        ' [+' + value.valuePrice?.formattedValue + ']'
      );
    });
  });
});
