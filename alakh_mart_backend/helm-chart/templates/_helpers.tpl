{{- define "alakh-mart.name" -}}
{{- default .Chart.Name .Values.nameOverride | trunc 63 | trimSuffix "-" -}}
{{- end -}}

{{- define "alakh-mart.fullname" -}}
{{- printf "%s-%s" (include "alakh-mart.name" .) .Release.Name | trunc 63 | trimSuffix "-" -}}
{{- end -}}
