# Services Architecture

This project implements a services layer to handle API interactions with error simulation and optimistic updates.

## Structure

```
src/services/
├── api/
│   └── leadService.ts    # Lead-specific API operations
├── types/
│   └── api.ts           # Shared API type definitions
└── index.ts             # Service exports
```

## Features

### Error Simulation
- **Random Failures**: 10% chance of simulated API failures
- **Network Delays**: Random delays between 300ms-2000ms to simulate real network conditions
- **Configurable**: Easy to adjust failure rates and delay ranges

### Optimistic Updates
- **Immediate UI Updates**: Changes appear instantly in the UI
- **Automatic Rollback**: Failed updates automatically revert to previous state
- **Error Handling**: Comprehensive error messages and logging

## Usage

### Lead Service
```typescript
import { leadService } from '../services';

// Update a lead with optimistic updates
const result = await leadService.updateLead(updatedLead);
if (result.success) {
  // Update successful
} else {
  // Handle error: result.error
}
```

### In Components
The `useLeads` hook now returns an async `updateLead` function:

```typescript
const { updateLead } = useLeads();

const handleSave = async (lead: Lead) => {
  const result = await updateLead(lead);
  if (result.success) {
    showToast('Lead updated successfully!', 'success');
  } else {
    showToast(result.error, 'error');
  }
};
```

## Error Simulation Configuration

You can adjust the failure rate in `leadService.ts`:

```typescript
// Current: 10% failure rate
const shouldSimulateFailure = () => Math.random() < 0.1;

// For 20% failure rate:
const shouldSimulateFailure = () => Math.random() < 0.2;
```

## Benefits

1. **Better UX**: Optimistic updates provide immediate feedback
2. **Realistic Testing**: Error simulation helps test error handling
3. **Maintainable**: Clear separation between UI and API logic
4. **Scalable**: Easy to add new services following the same pattern
5. **Type Safe**: Full TypeScript support with proper error handling

## Future Enhancements

- Retry logic for failed requests
- Request queuing for offline scenarios
- Caching layer for performance
- Rate limiting simulation
- Network status handling
