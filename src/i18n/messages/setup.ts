import { params } from '@nanostores/i18n'
import { i18n } from '@wificonfig/ui'

export const setupMessages = i18n('setup', {
  stepOf: params<{ current: string; total: string }>('Step {current} of {total}'),
  stepLabel: params<{ step: string }>('Step {step}'),
  welcomeTitle: params<{ product: string }>('Welcome to {product}'),
  welcomeSubtitle: "Let's get your device set up.",
  deviceNameLabel: 'Device Name',
  deviceNamePreview: params<{ name: string }>('Your device will be reachable at {name}.local'),
  deviceNameHelp: 'What is this?',
  deviceNameHelpText: params<{ name: string }>(
    'This name lets you find your device on your local network. Instead of remembering an IP address, you can use {name}.local in your browser.'
  ),
  loading: 'Loading...',
  next: 'Next',
  save: 'Save',
  saving: 'Saving...',
  saved: 'Device name saved.',
  errorInvalid:
    'Use 1–63 lowercase letters, numbers, or hyphens. Cannot start/end with a hyphen.',
  errorLoadFailed: 'Could not load the current device name. You can still enter a new one.',
  errorSaveFailed: 'Failed to save. Please try again.',
  wifiTitle: 'Connect to WiFi',
  wifiSubtitle: 'Select your network to get online.',
})
