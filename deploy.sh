#gcloud builds submit --tag gcr.io/PROJECT-ID/helloworld
PROJECT="donation"
gcloud init

gcloud builds submit --tag gcr.io/$PROJECT/web

gcloud run deploy --image gcr.io/$PROJECT/web
