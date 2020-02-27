#!/bin/sh

# set source type
SOURCE_TYPE=music_index
export SOURCE_TYPE


# include
# . "`dirname $0`/env.sh"

# mode
MODE=$1
ELASTIC_HOST="localhost:9200"
echo -- run as ${MODE}
case $MODE in
init)
    # SOURCE_BUILD=`${BASE_PATH}/bin/utils/newindex.sh ${ELASTICSEARCH_HOST} ${SOURCE_TYPE}`
    ELASTIC_HOST="localhost:9200"
    export ELASTIC_HOST

    ELASTIC_INDEX=${SOURCE_TYPE}_01
    export ELASTIC_INDEX

    echo "{ ELASTIC_HOST=>\""localhost:9200"\", ELASTIC_INDEX=>\""${ELASTIC_INDEX}"\" }"

	curl -XPUT 'http://'"localhost:9200"'/'"${ELASTIC_INDEX}" -H 'Content-Type: application/json' -s -d '
    {
         "settings" : {
            "index": {
                "number_of_shards" : 3,
                "number_of_replicas" : 1,
                "max_result_window": 1000000
            }
         },
         "mappings": {
			"contents": {
				"properties": {
					"no": {
						"type": "text"
					},
                    "title" : {
                        "type" : "text"
                    },
                    "artist" : {
                        "type" : "text"
                    },
                    "year" : {
                        "type" : "keyword"
                    },
                    "ranking" : {
                        "type" : "keyword"
                    }
				}
			}
        }
    }
    '; echo
    ;;



alias)
    SOURCE_BUILD=`${BASE_PATH}/bin/utils/lastindex.sh ${ELASTICSEARCH_HOST} ${SOURCE_TYPE}`
    ELASTIC_INDEX=${SOURCE_TYPE}_${SOURCE_BUILD}
    export ELASTIC_INDEX

    echo "{ ELASTIC_HOST=>\""${ELASTICSEARCH_HOST}"\", ELASTIC_INDEX=>\""${ELASTIC_INDEX}"\" }"

    ${BASE_PATH}/bin/utils/alias.sh "${ELASTICSEARCH_HOST}" "${ELASTIC_INDEX}" "${SOURCE_TYPE}" "${OPENQUERY_HOST}"

    ${BASE_PATH}/bin/utils/removeOldIndex.sh "${ELASTICSEARCH_HOST}" "${SOURCE_TYPE}" 2 "${OPENQUERY_HOST}"
    ;;




static)
    /bin/rm -rf ${BASE_PATH}/data/${SOURCE_TYPE}/

    export USE_STATIC=""
    export USE_DYNAMIC="--"
    export SCHEDULE=""

    # SOURCE_BUILD=`${BASE_PATH}/bin/utils/lastindex.sh ${ELASTICSEARCH_HOST} ${SOURCE_TYPE}`
    ELASTIC_INDEX=${SOURCE_TYPE}_01
    export ELASTIC_INDEX

    echo "{ ELASTIC_HOST=>\""localhost:9200"\", ELASTIC_INDEX=>\""${ELASTIC_INDEX}"\" }"

    /Users/may-han/Documents/ELK/logstash-6.5.4/bin/logstash --path.config /Users/may-han/Documents/ELK/logstash-6.5.4/config/music.conf --path.data ${BASE_PATH}/data/${SOURCE_TYPE}/logstash --path.logs ${LOG_PATH}/logstash ${LOGSTASH_OPTS} &
    CHILD_PID=$!
    trap "SIGNAL_TERM ${CHILD_PID}" TERM INT KILL
    wait "${CHILD_PID}"
    ;;


dynamic)
    export USE_STATIC="--"
    export USE_DYNAMIC=""
    export SCHEDULE="0-59/5 * * * *"

    SOURCE_BUILD=`${BASE_PATH}/bin/utils/lastindex.sh ${ELASTICSEARCH_HOST} ${SOURCE_TYPE}`
    ELASTIC_INDEX=${SOURCE_TYPE}_${SOURCE_BUILD}
    export ELASTIC_INDEX

    echo "{ ELASTIC_HOST=>\""${ELASTICSEARCH_HOST}"\", ELASTIC_INDEX=>\""${ELASTIC_INDEX}"\" }"

    ${LOGSTASH_PATH}/bin/logstash --path.config ${BASE_PATH}/config/${SOURCE_TYPE}/logstash.conf --path.data ${BASE_PATH}/data/${SOURCE_TYPE}/logstash --path.logs ${LOG_PATH}/logstash ${LOGSTASH_OPTS} &
    CHILD_PID=$!
    trap "SIGNAL_TERM ${CHILD_PID}" TERM INT KILL
    wait "${CHILD_PID}"
    ;;
*)
    echo "Usage) $0 [init|static|dynamic|alias]"
    exit 1
    ;;
esac
