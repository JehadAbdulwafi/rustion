import { msg } from '@lingui/core/macro';
import { useLingui } from '@lingui/react';
import { Check, ChevronDown, ChevronUp } from '@tamagui/lucide-icons';
import { Adapt, Select, SelectProps, Sheet, YStack } from 'tamagui';

interface SelectorProps extends SelectProps {
  defaultValue?: string
  label?: string
  data: { label: string, value: string }[]
  showTrigger?: boolean
}

export function Selector({ data, label, defaultValue, showTrigger = true, ...props }: SelectorProps) {
  const { _, i18n } = useLingui();
  return (
    <Select disablePreventBodyScroll {...props}>
      {showTrigger && (
        <Select.Trigger iconAfter={ChevronDown}>
          <Select.Value placeholder="Select" />
        </Select.Trigger>
      )}

      <Adapt when="sm" platform="touch">
        <Sheet
          native={!!props.native}
          dismissOnSnapToBottom
          modal
          snapPointsMode='fit'
          animationConfig={{
            type: 'spring',
            damping: 20,
            mass: 1.2,
            stiffness: 250,
          }}
        >
          <Sheet.Frame>
            <Sheet.ScrollView>
              <Adapt.Contents />
            </Sheet.ScrollView>
          </Sheet.Frame>
          <Sheet.Overlay
            animation="lazy"
            enterStyle={{ opacity: 0 }}
            exitStyle={{ opacity: 0 }}
          />
        </Sheet>
      </Adapt>

      <Select.Content zIndex={200000}>
        <Select.ScrollUpButton
          alignItems="center"
          justifyContent="center"
          position="relative"
          width="100%"
          height="$3"
        >
          <YStack zIndex={10}>
            <ChevronUp size={20} />
          </YStack>
        </Select.ScrollUpButton>

        <Select.Viewport
          animation="quick"
          animateOnly={['transform', 'opacity']}
          enterStyle={{ o: 0, y: -10 }}
          exitStyle={{ o: 0, y: 10 }}
          minWidth={200}
        >
          <Select.Group>
            {/* @ts-ignore */}
            <Select.Label>{_(label)}</Select.Label>
            {data.map((item, i) => (
              <Select.Item
                index={i}
                key={item.value}
                value={item.value}
                style={{ flexDirection: i18n.locale === 'ar' ? 'row-reverse' : 'row' }}
              >
                <Select.ItemText flex={1}>{_(item.label)}</Select.ItemText>
                <Select.ItemIndicator marginLeft="auto">
                  <Check size={16} />
                </Select.ItemIndicator>
              </Select.Item>
            ))}

          </Select.Group>
        </Select.Viewport>
      </Select.Content>
    </Select>
  )
}