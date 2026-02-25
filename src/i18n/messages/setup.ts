import { params } from '@nanostores/i18n'
import { i18n } from '../index'

export const setupMessages = i18n('setup', {
  stepOf: params<{ current: string; total: string }>('Step {current} of {total}'),
  welcomeTitle: 'Welcome to ESP WiFi Manager',
  welcomeSubtitle: "Let's get your device set up.",
  deviceNameLabel: 'Device Name',
  deviceNamePreview: params<{ name: string }>('Your device will be reachable at {name}.local'),
  deviceNameHelp: 'What is this?',
  deviceNameHelpText: params<{ name: string }>(
    'This name lets you find your device on your local network. Instead of remembering an IP address, you can use {name}.local in your browser.'
  ),
  next: 'Next',
  saving: 'Saving...',
  errorInvalid:
    'Use 1–63 lowercase letters, numbers, or hyphens. Cannot start/end with a hyphen.',
  errorSaveFailed: 'Failed to save. Please try again.',
  wifiTitle: 'Connect to WiFi',
  wifiSubtitle: 'Select your network to get online.',
})
